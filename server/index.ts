import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSessions } from "./auth";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup sessions
setupSessions(app);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Специальная обработка ошибок загрузки файлов
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Файл слишком большой. Максимальный размер: 10MB';
    } else if (err.message && err.message.includes('Недопустимый формат файла')) {
      message = err.message;
    }

    res.status(status).json({ message });

    // Логируем ошибку только если это не ошибка валидации файла
    if (status >= 500) {
      console.error('Server error:', err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

    // Serve uploaded images
    app.use('/uploads', express.static(path.join(process.cwd(), 'photosran')));
})();