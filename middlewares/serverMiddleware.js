const serverMiddleware = async (req, res, next) => {
	try {
		const Auth = req.headers.authorization.split(' ')[1];
		const token = '12345';

		// Fetch user data based on INN
		if (token !== Auth) {
			return res.status(401).json({ error: 'Unauthorized: Auth token does not match' });
		}

		// Attach user data to request object for use in next middleware/controller
		next();
	} catch (error) {
		next();
		// return res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = serverMiddleware;
