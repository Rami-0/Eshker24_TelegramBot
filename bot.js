const Promise = require("bluebird");
const TelegramBot = require("node-telegram-bot-api");
const UserServices = require("./services/user");
require("dotenv").config();

Promise.config({
  cancellation: true,
});

TelegramBot.Promise = Promise;

const TOKEN = process.env.TG_TOKEN;
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Welcome! Please share your phone number.");
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  const user = UserServices.findByINNOrPhoneNumber(msg.text);

  if (user) {
    const temp = UserServices.assignChatID(user, chatId);

    if (temp) {
      bot.sendMessage(temp.chatID, temp.PhoneNumber);
    }
  }
});

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot;
