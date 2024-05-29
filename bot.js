const Promise = require('bluebird');
const UserServices = require('./services/user');

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

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
bot.on('message', async (msg) => {
	console.log(msg);
	const chatId = msg.chat.id;
	const createdUser = { INN: '31312312', PhoneNumber: '039812309123', ChatID: chatId };
  
  try {
    const res = await UserServices.createUser(createdUser); // Use `await` to wait for the promise
    console.log(res);
    bot.sendMessage(chatId, 'Chat created successfully');
  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, 'Chat not created');
  }
});

bot.getMe().then((me) => {
	console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot; // Export the bot instance
