const Router = require("express");

const router = new Router();

const userController = require("../controller/user.controller");
const authMiddleware = require('../middlewares/authMiddleware');


router.post("/init", userController.init);
/**
 * Generates a One-Time Password (OTP) and sends it to the user for registration.
 * 
 * @param {string} req.body.INN - The user's INN (Individual Taxpayer Identification Number).
 * @param {string} req.body.PhoneNumber - The user's phone number.
 * 
 * @returns {JSON} - Returns a JSON object with the following properties:
 *  - message: The OTP message sent to the user.
 * 
 * @throws {HTTPError} - Returns an appropriate HTTP error response if:
 *  - The user is not found based on the provided INN or phone number (404 Not Found).
 *  - There is an internal server error during OTP generation or message sending (500 Internal Server Error).
 *  - The chat ID is not set for the user (400 Bad Request).
 */
router.post('/registration/otp', authMiddleware, userController.createOTP);
router.post('/registration/verification', authMiddleware, userController.VerifyOTP);


module.exports = router;
