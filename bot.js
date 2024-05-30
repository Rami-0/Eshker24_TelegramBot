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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

	// Create options for the button
	const options = {
		reply_markup: JSON.stringify({
			keyboard: [
				[{ text: 'Share Phone Number', request_contact: true }],
				[{ text: 'Share INN', request_contact: false }]
			],
			resize_keyboard: true,
		}),
	};

  bot.sendMessage(chatId, "Welcome! Please choose an option:", options);
});

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	// console.log(msg);

  const options = {
		reply_markup: JSON.stringify({
			keyboard: [
				[{ text: 'Share Phone Number', request_contact: true }],
				[{ text: 'Share INN', request_contact: false }]
			],
			resize_keyboard: true,
		}),
	};

	try {
		let user;
		if (msg?.contact) {
			const phoneNumber = msg.contact.phone_number;
			if (!phoneNumber.startsWith('+996')) {
				return;
			}
			user = await UserServices.findByINNOrPhoneNumber(phoneNumber);
		} else {
			const text = msg.text;
			const innLength = 13; // Define the valid length for INN
			const innPattern = /^(2020|2021)\d{9}$/; // Regex pattern to check INN starting with 2020 or 2021 and length of 13

			if (text.startsWith('+996')) {
				user = await UserServices.findByINNOrPhoneNumber(text);
			} else if (innPattern.test(text)) {
				user = await UserServices.findByINNOrPhoneNumber(text);
			} else {
				return;
			}
		}

		if (user.user && !user.message) {
			const updatedUser = await UserServices.assignChatID(user.user, chatId);

			console.log(updatedUser);
			if (updatedUser) {
				bot.sendMessage(chatId, `Chat ID assigned. Phone Number: ${updatedUser.PhoneNumber}`, options);
			} else {
				bot.sendMessage(chatId, 'Failed to assign chat ID.' , options);
			}
		} else if (user.message) {
			bot.sendMessage(chatId, user.message , options);
			// TODO: check the validity of the INN with the phone number
		} else {
			bot.sendMessage(chatId, 'User not found.' , options);
		}
	} catch (error) {
		console.error(error);
		bot.sendMessage(chatId, 'An error occurred. Please try again.');
	}
});

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

bot.on("inline_query", (query) => {
  const results = [
    {
      type: "article",
      id: "1",
      title: "Caps",
      input_message_content: { message_text: query.query.toUpperCase() },
    },
    {
      type: "article",
      id: "2",
      title: "Lowercase",
      input_message_content: { message_text: query.query.toLowerCase() },
    },
  ];
  bot.answerInlineQuery(query.id, results);
});

module.exports = bot;
