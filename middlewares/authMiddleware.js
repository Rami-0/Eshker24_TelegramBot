const UserServices = require('../services/user');

const authMiddleware = async (req, res, next) => {
  try {
    const Auth = req.headers.authorization.split(' ')[1];
    const { INN } = req.body;

    // Fetch user data based on INN
    const req_data = await UserServices.findByINN(String(INN));
    if (req_data && req_data.user) {
      const user = req_data.user;

      // Check if Auth matches
      if (user.Auth !== Auth) {
        return res.status(401).json({ error: 'Unauthorized: Auth token does not match'}); 
      }

      // Attach user data to request object for use in next middleware/controller
      req.user = user;
      next();
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding the user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
