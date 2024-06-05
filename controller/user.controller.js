const speakeasy = require('speakeasy');
const UserServices = require('../services/user');
const OTPServices = require('../services/otp');
const { sendMessage } = require('../api/api');
const base64 = require('base-64');

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
				// console.log(req_data);
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
					await sendMessage(chatId, message);

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
			// Auth: req.headers.authorization.split(' ')[1],
			INN: req.body.INN,
			Auth:req.body.pin
		};
		try {
			// TODO: Encrypt the Authorization Before saving it to the database
			const send = await UserServices.createUser(userData); // Use `await` to wait for the promise
			console.log(send);
			res.status(200).json({ success: 'User created successfully' ,	status:200 });
		} catch (err) {
			console.log(err);
			res.status(400).json({ error: err.message , status:400 });
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
				return res.status(200).json({ success: true , status:200});
			} else {
				return res.status(400).json({ success: false, message: isOtpValid , status:400 });
			}
		} catch (error) {
			console.error('Error while verifying INN:', error);
			throw error;
		}
	}

	static async registerUser(req, res) {
		console.log(req.body);
		const userData = {
			INN: req.body.INN,
			password: req.body.password,
			chatId: req.body.chatId,
		};
		let user;
		try {
			const req_data = await UserServices.findByINN(userData.INN);
			if (req_data) {
				user = req_data.user;
				const decoded_auth = base64.decode(req_data.user.Auth);
				console.log(decoded_auth);
				const Auth = decoded_auth.split(':')[1];

				if (Auth !== userData.password) {
					// Assuming the Auth should match the provided password
					res.status(401).json({ error: 'Incorrect Password' , status:401});
					return;
				}
			} else {
				res.status(404).json({ error: 'User not found' , status:404 });
				return;
			}

			try {
				await UserServices.assignChatID(user, userData.chatId); // Wait for the promise
				res.status(200).json({ success: 'User registered successfully' , status:200 });
			} catch (err) {
				console.error(err);
				res.status(400).json({ error: err.message, status:400 });
			}
		} catch (err) {
			console.error('Error while verifying INN:', err);
			res.status(500).json({ error: 'Internal server error', status:500 });
		}
	}

	static async checkIfUserHasRegisteredChat(req, res) {
		const { chatId } = req.query;
		try {
			const req_data = await UserServices.findByChatID(chatId);
			if (req_data && req_data.ChatID) {
				return res.status(200).json({ success: true , status:200});
			} else {
				return res.status(404).json({ error: 'User not found', status:404 });
			}
		} catch (error) {
			console.error('Error finding the user:', error);
			return res.status(500).json({ error: 'Internal Server Error', status:500 });
		}
	}
}

module.exports = UserController;
