const Promise = require('bluebird');
const TelegramBot = require('node-telegram-bot-api');
const UserServices = require("./services/user");
require('dotenv').config();

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

Promise.config({
	cancellation: true,
});

// TelegramBot.Promise = Promise;

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

bot.onText(/\/start/, async (msg) => {
	const chatId = msg.chat.id;

	try {
		const user = await UserServices.findByChatID(chatId);

		if (user) {
			bot.sendMessage(chatId, 'Welcome back!', {
				reply_markup: {
					keyboard: [['About us'], ['Help'], ['Complain']],
					one_time_keyboard: true,
					resize_keyboard: true,
				},
			});
		} else {
			bot.sendMessage(chatId, 'Welcome! Please register.', {
				reply_markup: {
					keyboard: [['Register'], ['Help']],
					one_time_keyboard: true,
					resize_keyboard: true,
				},
			});
		}
	} catch (error) {
		bot.sendMessage(chatId, 'An error occurred. Please try again later.');
		console.error(error);
	}
});

// Register command
bot.onText(/Register/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Please enter your INN:');

	bot.once('message', async (msg) => {
		const inn = msg.text;
		if (validateINN(inn)) {
			try {
				const result = await UserServices.findByINN(inn);
				const user = result.user;

				if (result.message) {
					bot.sendMessage(chatId, result.message);
				} else if (user) {
					await UserServices.assignChatID(user, chatId);
					bot.sendMessage(chatId, 'You are registered!', {
						reply_markup: {
							keyboard: [['About us'], ['Help'], ['Complain']],
							one_time_keyboard: true,
							resize_keyboard: true,
						},
					});
				} else {
					bot.sendMessage(chatId, 'INN not found. Please check and try again.');
				}
			} catch (error) {
				bot.sendMessage(chatId, 'An error occurred during registration. Please try again later.');
				console.error(error);
			}
		} else {
			bot.sendMessage(chatId, 'Invalid INN. Please try again.');
		}
	});
});

// About us command
bot.onText(/About us/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'We are a company that provides awesome services.');
});

// Help command
bot.onText(/Help/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Help Menu:', {
		reply_markup: {
			keyboard: [['Change Chat'], ['Request Chat ID'], ['Back']],
			one_time_keyboard: true,
			resize_keyboard: true,
		},
	});
});

// Change Chat command
bot.onText(/Change Chat/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Please enter your new Chat ID:');

	bot.once('message', async (msg) => {
		const newChatId = msg.text;
		bot.sendMessage(chatId, 'Please enter your INN:');

		bot.once('message', async (msg) => {
			const inn = msg.text;
			if (validateINN(inn)) {
				try {
					const result = await UserServices.findByINN(inn);
					const user = result.user;

					if (user) {
						await UserServices.assignChatID(user, newChatId);
						bot.sendMessage(chatId, 'Done! See you on the other side!! 🚀');
						bot.sendMessage(newChatId, 'Your chat ID has been updated successfully.');
					} else {
						bot.sendMessage(chatId, 'INN not found. Please check and try again.');
					}
				} catch (error) {
					bot.sendMessage(chatId, 'An error occurred during the chat ID update. Please try again later.');
					console.error(error);
				}
			} else {
				bot.sendMessage(chatId, 'Invalid INN. Please try again.');
			}
		});
	});
});

// Request Chat ID command
bot.onText(/Request Chat ID/, async (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, `Your current chat ID is: ${chatId}`);
});

// Complain command
bot.onText(/Complain/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Please enter your complaint:');

	bot.once('message', async (msg) => {
		const complaint = msg.text;
		// Here you would typically save the complaint to your database
		bot.sendMessage(chatId, 'Thank you for your feedback. We will look into it.');
		console.log(`Complaint from user ${chatId}: ${complaint}`);
	});
});

// Handle "Back" button
bot.onText(/Back/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Main Menu:", {
    reply_markup: {
      keyboard: [['About us'], ['Help'], ['Complain']],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
});


// Function to validate INN (example validation)
function validateINN(inn) {
	return /^\d{14}$/.test(inn);
}

module.exports = bot;
