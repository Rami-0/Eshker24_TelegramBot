const speakeasy = require('speakeasy');
const bot = require('../bot');
const UserServices = require('../services/user');
const OTPServices = require('../services/otp');
class UserController {
	static async createOTP(req, res) {
		try {
			const { INN, expiry } = req.body;
			const expiryInMinutes = expiry || 3;
			const expiryDate = new Date(Date.now() + expiryInMinutes * 60 * 1000);

			let chatId;
			let user;

			try {
				const req_data = await UserServices.findByINN(INN);
				console.log(req_data);
				if (req_data && req_data.user) {
					chatId = req_data.user.ChatID;
					user = req_data.user;
				} else {
					res.status(404).json({ error: 'User not found' });
					return;
				}
			} catch (error) {
				console.error('Error finding the user:', error);
				res.status(500).json({ error: 'Internal Server Error' });
				return;
			}

			if (chatId) {
				const secret = speakeasy.generateSecret({ length: 6 });
				const code = speakeasy.totp({
					secret: secret.base32,
					encoding: 'base32',
				});

				try {
					const AddOtp = await OTPServices.createOTP({ User_id: user.id, otp: code, expiry: expiryDate });

					const message = `Your OTP code is: ${code}`;

					// Send message to the user
					await bot.sendMessage(chatId, message);
					res.status(200).json({ otp: code, expiry: expiryDate });
				} catch (sendError) {
					console.error('Error sending message or creating OTP:', sendError);
					res.status(500).json({ error: 'Failed to send message or create OTP' });
				}
			} else {
				console.error('Chat ID is not set for the user.');
				res.status(400).json({ error: "Chat ID doesn't exist" });
			}
		} catch (error) {
			console.error('Error generating OTP:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	static async init(req, res) {
		const userData = {
			Auth: req.headers.authorization.split(' ')[1],
			INN: req.body.INN,
		};
		try {
			// TODO: Encrypt the Authorization Before saving it to the database
			const send = await UserServices.createUser(userData); // Use `await` to wait for the promise
			console.log(send);
			res.status(200).json({ success: 'User created successfully' });
		} catch (err) {
			console.log(err);
			res.status(400).json({ error: err.message });
		}
	}

	static async VerifyOTP(req, res) {
		const data = {
			INN: req.body.INN,
			otp: req.body.otp,
		};

		
		try {
			const req_data = await UserServices.findByINN(data.INN);
			const User_id = req_data.user.id;
			// Assuming you have a method to verify OTP
			const isOtpValid = await OTPServices.verifyOtp(User_id, data.otp); // Function to verify OTP for the user

			if (isOtpValid === 'success') {
				return res.status(200).json({ success: true });
			} else {
				return res.status(400).json({ success: false, message: isOtpValid });
			}
		} catch (error) {
			console.error('Error while verifying INN:', error);
			throw error;
		}
	}
}

module.exports = UserController;
