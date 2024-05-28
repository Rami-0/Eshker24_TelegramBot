const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const TOKEN = process.env.TG_TOKEN
// const URL = process.env.URL
const bot = new TelegramBot(TOKEN, {
    polling: true
});

// const Database = require('./base');
const TextController = require('./TextController');

bot.on('message', async (message) => {
    TextController(message, bot, db="*")
});
