const { Router } = require('express');

const router = new Router();

const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const serverMiddleware = require('../middlewares/serverMiddleware');

/**
 * Инициализировать сессию пользователя.
 * @param {Object} req - Объект запроса.
 *    @body {string} INN - ИНН пользователя.
 *    @body {string} pin - Пин-код для аутентификации пользователя.
 * @param {Object} res - Объект ответа.
 * @returns {Object} - status { code , message }
 *    @returns {number} 0 - Если сессия пользователя успешно инициализирована.
 *    @returns {number} 6 - Если произошла внутренняя ошибка сервера.
 */

router.post('/init', authMiddleware, userController.init);

/**
 * Создать OTP для пользователя.
 * @param {Object} req - Объект запроса.
 *    @body {string} INN - ИНН пользователя.
 *    @body {number} [expiry=180] - Время истечения срока действия OTP в секундах. --необязательный
 *    @body {string} [message] - Сообщение для отправки вместе с OTP. --необязательный
 * @param {Object} res - Объект ответа.
 * @returns {Object} - status { code , message }
 *    @returns {number} 8 - Если OTP успешно отправлено.
 *    @returns {number} 1 - Если пользователь не найден.
 *    @returns {number} 14 - Если пользователь не вошел в систему.
 *    @returns {number} 4 - Если ID чата недействителен.
 *    @returns {number} 13 - Если возникла ошибка при отправке OTP.
 *    @returns {number} 6 - Если произошла внутренняя ошибка сервера.
 */

router.post('/user/otp', authMiddleware, userController.createOTP);

/**
 * Проверить предоставленный пользователем OTP.
 * @param {Object} req - Объект запроса.
 *    @body {string} INN - ИНН пользователя.
 *    @body {string} otp - OTP, предоставленный пользователем.
 * @param {Object} res - Объект ответа.
 * @returns {Object} - status { code , message }
 *    @returns {number} 0 - Если OTP успешно проверен.
 *    @returns {number} 5 - Если проверка OTP не удалась.
 *    @returns {number} 6 - Если произошла внутренняя ошибка сервера.
 */

router.post('/user/verification', authMiddleware, userController.VerifyOTP);

/**
 * Проверка OTP со стороны Ishker.
 * @param {Object} req - Объект запроса.
 *    @body {string} INN - ИНН пользователя.
 *    @body {string} otp - OTP, предоставленный пользователем.
 *    @body {string} Chat_ID - ID чата пользователя.
 * @param {Object} res - Объект ответа.
 * @returns {Object} - status { code , message }
 *    @returns {number} 0 - Если OTP успешно проверен.
 *    @returns {number} 5 - Если проверка OTP не удалась.
 *    @returns {number} 4 - Если ID чата недействителен.
 *    @returns {number} 6 - Если произошла внутренняя ошибка сервера.
 */

router.put('/user/verification', authMiddleware, userController.VerifyOTP_fromIshkerSide);

/**
 * Удалить подключение пользователя на основе ИНН и ID чата.
 * @param {Object} req - Объект запроса.
 *    @body {string} INN - ИНН пользователя.
 *    @body {string} Chat_ID - ID чата пользователя.
 * @param {Object} res - Объект ответа.
 * @returns {Object} - status { code , message }
 *    @returns {number} 1 - Если пользователь не найден.
 *    @returns {number} 17 - Если пользователь успешно удален.
 */

router.delete('/user/delete', authMiddleware, userController.DeleteUserConnection)

// for webApp. 

router.get('/registration', serverMiddleware, userController.checkIfUserHasRegisteredChat);

router.post('/registration', serverMiddleware, userController.registerUser);

router.put('/registration', serverMiddleware, userController.updatePassword);

router.post('/set_auth', serverMiddleware, userController.setAuth);


module.exports = router;
