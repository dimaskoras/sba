import { Request } from "@shared/schema";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "7644033376:AAGfQfJmNCk13K3FP1HgfHU9DsKbXcatjN8";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID || "1598838783";

export async function sendTelegramMessage(request: Request): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot token or chat ID not configured");
    return;
  }

  const message = `
🔥 Новая заявка с сайта SmartBuildAstana!

👤 Имя: ${request.name}
📞 Телефон: ${request.phone}
💬 Комментарий: ${request.comment || "Не указан"}
🕒 Время: ${new Date(request.created_at).toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })}

#заявка #smartbuildastana
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error: ${error}`);
    }

    console.log("Telegram message sent successfully");
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    throw error;
  }
}
