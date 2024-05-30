const express = require("express");
const ngrok = require("@ngrok/ngrok");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TG_TOKEN;
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/webhook", (req, res) => {
  const message = req.body.message;
  if (message) {
    const chat_id = message.chat.id;
    console.log(`Chat ID: ${chat_id}`);
  }
  res.sendStatus(200);
});

async function setup() {
  if (!NGROK_AUTHTOKEN) {
    throw new Error("NGROK_AUTHTOKEN не определен в окружении");
  }

  // Создание сессии ngrok
  const session = await new ngrok.SessionBuilder()
    .authtoken(NGROK_AUTHTOKEN)
    .metadata("Online in One Line")
    .connect();

  // Создание слушателя
  const listener = await session.httpEndpoint().listen();

  // Привязка слушателя к приложению
  const socket = await ngrok.listen(app, listener);
  const ngrokUrl = listener.url();
  console.log(`Ingress established at: ${ngrokUrl}`);
  console.log(`Express listening on: ${socket.address()}`);

  // Установка вебхука для Telegram
  const setWebhookUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${ngrokUrl}/webhook`;
  const response = await fetch(setWebhookUrl);
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Failed to set webhook: ${data.description}`);
  }
  console.log(`Webhook set to ${ngrokUrl}/webhook`);
}

setup().catch((err) => {
  console.error("Ошибка при настройке ngrok:", err);
});
