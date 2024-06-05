const { Router } = require('express');

const router = new Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const serverMiddleware = require('../middlewares/serverMiddleware');


/**
 * First init in application.
 *
 * @param {string} req.body.INN - The user's INN (Individual Taxpayer Identification Number).
 * @param {string} req.body.pin - The user's pin.
 *
 * @returns {JSON} - Returns a JSON object with the following properties:
 *  - message: The OTP message sent to the user.
 *
 * @throws {HTTPError} - Returns an appropriate HTTP error response if:
 *  - The user is not found based on the provided INN or phone number (404 Not Found).
 *  - There is an internal server error during OTP generation or message sending (500 Internal Server Error).
 *  - The chat ID is not set for the user (400 Bad Request).
 */
router.post('/init', authMiddleware, userController.init);
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

// for webApp. 

/**
 * @returns {boolean} - Returns true if the user is registered, otherwise false. 
 */
router.get('/registration', serverMiddleware, userController.checkIfUserHasRegisteredChat);

/**
 * Registers a user by verifying their INN and password, and assigns a chat ID if the verification is successful.
 * 
 * @async
 * @param {string} req.body.INN - The INN (taxpayer identification number) of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.chatId - The chat ID to be assigned to the user.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {200, 401, 404}
 * 
 * @throws {Error} - Throws an error if there is an issue during the process.
 * 
 * @example
 * // Sample request body
 * {
 *   "INN": "123456789",
 *   "password": "userpassword",
 *   "chatId": "chat123"
 * }
 * 
 * // Sample success response
 * {
 *   "success": "User registered successfully"
 * }
 * 
 * // Sample error responses
 * {
 *   "error": "Incorrect Password"
 * }
 * 
 * {
 *   "error": "User not found"
 * }
 * 
 * {
 *   "error": "Internal server error"
 * }
 */

router.post('/registration', serverMiddleware, userController.registerUser);

module.exports = router;
