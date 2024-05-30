const Promise = require("bluebird");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

Promise.config({
  cancellation: true,
});

TelegramBot.Promise = Promise;

const TOKEN = process.env.TG_TOKEN;
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome! Please share your phone number.");
});

bot.on("message", (msg) => {
  console.log(msg);
  const chatId = msg.chat.id;

  console.log(msg.text);
});

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot;
