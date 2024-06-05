const UserServices = require('../services/user');
const base64 = require('base-64');

const AllowedUsers = {
	'M-I': '1234',
	'P-I': '12345',
	'M-R': '123456',
	'P-R': '1234567',
};

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		console.log(authHeader)
		if (!authHeader || !authHeader.startsWith('Basic ')) {
			return res.status(401).json({ error: 'Unauthorized: No authorization header provided' });
		}

		const base64Credentials = authHeader.split(' ')[1];
		const credentials =  base64.decode(base64Credentials);
		const [username, password] = credentials.split(':');

		// Check if the username is in the AllowedUsers and the password matches
		if (AllowedUsers[username] !== password) {
			return res.status(401).json({ error: 'Unauthorized: Invalid username or password' });
		}

    next();

	} catch (error) {
		console.error('Error finding the user:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = authMiddleware;
