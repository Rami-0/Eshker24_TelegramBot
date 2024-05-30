const speakeasy = require('speakeasy');
const bot = require('../bot');
const UserServices = require('../services/user');
class UserController {
	async createOTP(req, res) {
		try {
			const { INN, PhoneNumber } = req.body;
			const secret = speakeasy.generateSecret({ length: 6 });

			const code = speakeasy.totp({
				secret: secret.base32,
				encoding: 'base32',
			});

			const message = `Password: ${code}`;

			//TODO: we need to find his chat ID first
			// if (true == false) {
			// 	// Check if chatId is available for this user
			// 	await bot.sendMessage(chatId, message);
			// } else {
			// 	console.error(`Chat ID for user ID: ${userId} is not set.`);
			// }
			// bot.sendMessage(chatId, message);
			res.status(200).json(message);
		} catch (error) {
			console.error('Error send finding the user:', error);
			//   res.status(500).json({ error: "Internal Server Error" });
		}
	}
	async init(req, res) {
		const userData = {
			PhoneNumber: req.body.PhoneNumber,
			INN: req.body.INN,
		};
		try {
			const send = await UserServices.createUser(userData); // Use `await` to wait for the promise
			console.log(send);
			// bot.sendMessage(chatId, 'Chat created successfully');
			res.status(200).json({ success: 'User created successfully' });
		} catch (err) {
			console.log(err);
			res.status(400).json({ error: err.message });
			// bot.sendMessage(chatId, 'Chat not created');
		}
	}
}

module.exports = new UserController();
