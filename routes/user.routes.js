const { Router } = require('express');

const router = new Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const serverMiddleware = require('../middlewares/serverMiddleware');


router.post('/init', authMiddleware, userController.init);
router.post('/user/otp', authMiddleware, userController.createOTP);
router.post('/user/verification', authMiddleware, userController.VerifyOTP);

router.put('/user/verification', authMiddleware, userController.VerifyOTP_fromIshkerSide);
  /**
   * Delete a user connection based on INN and Chat_ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The response status and message.
   */
router.delete('/user/delete', authMiddleware, userController.DeleteUserConnection)

// for webApp. 

router.get('/registration', serverMiddleware, userController.checkIfUserHasRegisteredChat);

router.post('/registration', serverMiddleware, userController.registerUser);

router.put('/registration', serverMiddleware, userController.updatePassword);

router.post('/set_auth', serverMiddleware, userController.setAuth);


module.exports = router;
