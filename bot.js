const Promise = require("bluebird");

const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Manually enable cancellation of promises
Promise.config({
  cancellation: true,
});

TelegramBot.Promise = Promise;

const TOKEN = process.env.TG_TOKEN;
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

// Log chat ID when a message is received

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot; // Export the bot instance
