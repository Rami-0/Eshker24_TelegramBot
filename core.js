const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const UserServices = require('./services/user');

if (process.env.TG_TOKEN === undefined) {
	console.error('TG_TOKEN is not defined! add an environment variable named TG_TOKEN with your bot token as value.');
	process.exit(1);
}

const webAppUrl = 'https://tg-react-webapp.vercel.app/';
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });
bot.on('polling_error', (msg) => console.log(msg));

bot.getMe().then((me) => {
	console.log(`Bot ${me.username} is up and running...`);
});

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text;

	if (text === '/start') {
		const user = await UserServices.findByChatID(chatId);
		if (user) {
			bot.sendMessage(chatId, 'Welcome back!', {
				reply_markup: {
					inline_keyboard: [[{ text: 'About us', web_app: { url: webAppUrl + 'about' } }], [{ text: 'Help', web_app: { url: webAppUrl + 'help' } }], [{ text: 'Complain', web_app: { url: webAppUrl + 'complain' } }]],
					one_time_keyboard: true,
					resize_keyboard: true,
				},
			});
		} else {
			await bot.sendMessage(chatId, 'Fill the form', {
				reply_markup: {
					inline_keyboard: [[{ text: 'Visit Website', web_app: { url: webAppUrl } }]],
					one_time_keyboard: true,
					resize_keyboard: true,
				},
			});
			console.log('Message received', msg.text);
		}
	}
});

module.exports = bot;
