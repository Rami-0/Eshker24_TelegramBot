const TelegramBot = require("node-telegram-bot-api");
const Promise = require("bluebird");
require("dotenv").config();

Promise.config({
  cancellation: true,
});

TelegramBot.Promise = Promise;

const TOKEN = process.env.TG_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const startController = require("./controllersTG/startController");
const callbackController = require("./controllersTG/callbackController");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  startController.startMessage(bot, chatId, name);
});

bot.on("callback_query", (callbackQuery) => {
  callbackController.handleCallbackQuery(bot, callbackQuery);
});

bot.on("polling_error", (error) => console.log(error));
bot.on("error", (error) => console.log(error));

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot;
