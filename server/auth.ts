import session from 'express-session';
import { Express, Request, Response, NextFunction } from 'express';

// Типы для сессии
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAuthenticated?: boolean;
  }
}

// Middleware для проверки авторизации
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Настройка сессий
export function setupSessions(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true только для HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
  }));
}