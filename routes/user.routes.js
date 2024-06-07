const { Router } = require('express');

const router = new Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const serverMiddleware = require('../middlewares/serverMiddleware');


router.post('/init', authMiddleware, userController.init);
router.post('/registration/otp', authMiddleware, userController.createOTP);
router.post('/registration/verification', authMiddleware, userController.VerifyOTP);
router.put('/registration/verification', authMiddleware, userController.VerifyOTP_fromIshkerSide);

// for webApp. 

router.get('/registration', serverMiddleware, userController.checkIfUserHasRegisteredChat);

router.post('/registration', serverMiddleware, userController.registerUser);

router.put('/registration', serverMiddleware, userController.updatePassword);
//TODO: Handle these end points gracefully 
router.post('/set_auth', serverMiddleware, userController.setAuth);


module.exports = router;
