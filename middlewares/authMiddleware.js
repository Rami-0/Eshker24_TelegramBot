// middleware/authMiddleware.js
const AllowedServersServices = require('../services/allowedServers');
const base64 = require('base-64');

const authMiddleware = async (req, res, next) => {
  try {
    console.log(req)
    const authHeader = req.headers.authorization;

    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No authorization header provided' });
    }

    const splitBearer = authHeader.split(' ')[1];
    // const credentials = base64.decode(base64Credentials);
    const [servername, password] = splitBearer.split(':');

    // Use AllowedServersServices to verify the user
    const isValidUser = await AllowedServersServices.verifyServers(servername, password);
    
    if (!isValidUser) {
      return res.status(401).json({ error: 'Unauthorized: Invalid username or password' });
    }

    next();
  } catch (error) {
    console.error('Error during user verification:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
