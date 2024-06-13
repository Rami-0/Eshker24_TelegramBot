const logger = require('../utils/logger');

const serverMiddleware = async (req, res, next) => {
	try {
		const Auth = req.headers.authorization.split(' ')[1];
		const token = '12345';

		// Fetch user data based on INN
		if (token !== Auth) {
			logger.warn(`unauthorized server tried to access with the ${Auth.split('-')[0]}` )
			return res.status(401).json({ error: 'Unauthorized: Auth token does not match' });
		}

		// Attach user data to request object for use in next middleware/controller
		req.servername = 'webApp'
		next();
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = serverMiddleware;
