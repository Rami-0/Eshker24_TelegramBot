// middleware/authMiddleware.js
const AllowedServersServices = require('../services/allowedServers');
const base64 = require('base-64');
const { statusCodes } = require('../constants/statusCode');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({status: statusCodes.UNAUTHORIZED});
    }

    const splitBearer = authHeader.split(' ')[1];
    // const credentials = base64.decode(base64Credentials);
    const [servername, password] = splitBearer.split(':');

    // Use AllowedServersServices to verify the user
    const isValidUser = await AllowedServersServices.verifyServers(servername, password);
    
    if (!isValidUser) {
      return res.status(401).json({status: statusCodes.UNAUTHORIZED_KEY});
    }

    next();
  } catch (error) {
    console.error('Error during user verification:', error);
    return res.status(500).json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
};

module.exports = authMiddleware;
