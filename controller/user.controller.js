const speakeasy = require('speakeasy');
const UserServices = require('../services/user');
const OTPServices = require('../services/otp');
const { sendMessage } = require('../api/api');
const { statusCodes } = require('../constants/statusCode');
const logger = require('../utils/logger');

class UserController {

  static async spamUsersAction(req, res) {
  try {
    const { INNs, message } = req.body; // Expecting INNs to be an array of INN strings
    if (!Array.isArray(INNs) || INNs.length === 0) {
      logger.warn(`Invalid INNs array received from server: ${req.servername}`);
      return res.status(400).json({ status: statusCodes.INVALID_INPUT });
    }

    const users = await UserServices.findLoggedInUsersByINNs(INNs);
    if (users.length === 0) {
      logger.warn(`No users found for provided INNs from server: ${req.servername}`);
      return res.status(404).json({ status: statusCodes.USER_NOT_FOUND });
    }

    for (const user of users) {
      await sendMessage(user.ChatID, message);
      logger.info(`Message sent to user with ChatID: ${user.ChatID} from server: ${req.servername}`);
    }

    res.status(200).json({ status: statusCodes.OK });
  } catch (error) {
    logger.error(`Error spamming users from server: ${req.servername} - ${error.message}`);
    // console.error('Error spamming users:', error);
    res.status(500).json({ status: statusCodes.INTERNAL_SERVER_ERROR });
  }
}
  static async ActivateUser(req, res) {
    try {
      const { INN } = req.body;
      const req_data = await UserServices.findByINN(INN);

      if (!req_data) {
        logger.warn(`User not found for INN: ${INN} from server: ${req.servername}`);
        return res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
      }

      if (req_data.user.ChatID) {
        if (req_data.user.loggedIn === false) {
          await UserServices.ActivateUser(INN);
          logger.info(`User activated for INN: ${INN} from server: ${req.servername}`);
          return res.status(200).json({ status: statusCodes.USER_ACTIVATED });
        } else if (req_data.user.loggedIn === true) {
          logger.info(`User already activated for INN: ${INN} from server: ${req.servername}`);
          return res.status(201).json({ status: statusCodes.USER_ALREADY_ACTIVATED });
        }
      } else {
        logger.warn(`User is not registered for INN: ${INN} from server: ${req.servername}`);
        return res.status(400).json({ status: statusCodes.USER_IS_NOT_REGISTERED });
      }
    } catch (error) {
      logger.error(`Error activating user for INN: ${INN} from server: ${req.servername} - ${error.message}`);
      res.status(500).json({ status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }
  static async DeactivateUser(req, res) {
    try {
      const { INN } = req.body;
      const req_data = await UserServices.findByINN(INN);

      if (!req_data) {
        logger.warn(`User not found for INN: ${INN} from server: ${req.servername}`);
        return res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
      }

      if (req_data.user.ChatID) {
        if (req_data.user.loggedIn === true) {
          await UserServices.DeactivateUser(INN);
          logger.info(`User deactivated for INN: ${INN} from server: ${req.servername}`);
          return res.status(200).json({ status: statusCodes.USER_DEACTIVATED });
        } else if (req_data.user.loggedIn === false) {
          logger.info(`User already deactivated for INN: ${INN} from server: ${req.servername}`);
          return res.status(201).json({ status: statusCodes.USER_ALREADY_DEACTIVATED });
        }
      } else {
        logger.warn(`User is not registered for INN: ${INN} from server: ${req.servername}`);
        return res.status(400).json({ status: statusCodes.USER_IS_NOT_REGISTERED });
      }
    } catch (error) {
      logger.error(`Error deactivating user for INN: ${INN} from server: ${req.servername} - ${error.message}`);
      res.status(500).json({ status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async GetUserData(req, res){
    try{
      // recive INN from param of get request
      const { inn } = req.query;
      const req_data = await UserServices.findByINN(inn);
      if (!req_data) {
        logger.warn(`User not found for INN: ${inn} from server: ${req.servername}`);
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      } else if (req_data.user) {
        logger.info(`User data retrieved for INN: ${inn} from server: ${req.servername}`);
        res.status(200).json({ user: req_data.user, statusCodes: statusCodes.OK });
        return;
      }
      else{
        logger.warn(`User not found for INN: ${inn} from server: ${req.servername}`);
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      }
    }
    catch (error) {
      logger.error(`Error retrieving user data for INN: ${inn} from server: ${req.servername} - ${error.message}`);
      res.status(500).json({ status: statusCodes.INTERNAL_SERVER_ERROR });
      return;
    }
  }
  static async DeleteUserConnection(req, res) {
    try {
      const { INN, Chat_ID } = req.body;
      const req_data = await UserServices.findByINN(INN);
      if (!req_data) {
        logger.warn(`User not found for INN: ${INN} from server: ${req.servername}`);
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      } else if (req_data.user.ChatID!== Chat_ID) {
        logger.warn(`Chat ID mismatch for INN: ${INN} from server: ${req.servername}`);
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      } else {
        await UserServices.DeleteUserConnection(INN, Chat_ID);
        logger.info(`User connection deleted for INN: ${INN} from server: ${req.servername}`);
        res.status(200).json({ status: statusCodes.USER_DELETED });
        return;
      }
    } catch (error) {
      logger.error(`Error deleting user connection for INN: ${INN} from server: ${req.servername} - ${error.message}`);
      res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
      return;
    }
  }

  static async setAuth(req, res) {
    try {
      const { INN, chatId } = req.body;
      const req_data = await UserServices.findByINN(INN);
      // console.log(req_data.message)
      if (!req_data) {
        const secret = speakeasy.generateSecret({ length: 8 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });
        const expiryInSec = 1000;
        const expiryDate = new Date(Date.now() + expiryInSec * 1000);
        const CreateUnregisterdUser = await UserServices.CreateUserWithINN(INN, chatId, code, expiryDate);
        logger.info(`Unregistered user created for INN: ${INN} from server: ${req.servername}`);
        res.status(200).json({ ...CreateUnregisterdUser, status: statusCodes.UNREGISTERED_USER_CREATED });
        return;
      } else if (req_data.message && req_data.user.ChatID == chatId) {
        logger.warn(`User already registered for INN: ${INN} from server: ${req.servername}`);
        res.status(400).json({ status: statusCodes.USER_ALREADY_REGISTERED });
        return;
      } else if (req_data.user.ChatID === chatId) {
        const secret = speakeasy.generateSecret({ length: 8 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });
        const expiryInSec = 1000;
        const expiryDate = new Date(Date.now() + expiryInSec * 1000);
        const updateUser = await UserServices.updateUserAndCreateOTP(INN, chatId, code, expiryDate);
        logger.info(`User OTP updated for INN: ${INN} from server: ${req.servername}`);
        res.status(200).json({ ...updateUser, status: statusCodes.OK });
        return;
      } else {
        const secret = speakeasy.generateSecret({ length: 8 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });
        const expiryInSec = 1000;
        const expiryDate = new Date(Date.now() + expiryInSec * 1000);
        const data = await UserServices.updateUserAndCreateOTP(INN, chatId, code, expiryDate);
        logger.info(`User OTP created for INN: ${INN} from server: ${req.servername}`);
        res.status(200).json({ ...data, status: statusCodes.OK });
        return;
      }
    } catch (error) {
      logger.error(`Error updating user for INN: ${INN} from server: ${req.servername} - ${error.message}`);
      // console.error('Error updating user:', error);
      res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async VerifyOTP_fromIshkerSide(req, res) {
    const data = {
      INN: req.body.INN,
      otp: req.body.otp,
      Chat_ID: req.body.Chat_ID
    };

    try {
      const req_data = await UserServices.findByINN(data.INN);
      const User_id = req_data.user.id;

      if (data.Chat_ID === req_data.user.ChatID) {
        const isOtpValid = await OTPServices.verifyOtp(User_id, data.otp);

        if (isOtpValid === 'success') {
          const verify_user = await UserServices.verify_user(req_data.user);
          sendMessage(data.Chat_ID, "\u2705");
          logger.info(`OTP successfully verified for INN: ${data.INN} from server: ${req.servername}`);
          return res.status(200).json({ success: true, status: statusCodes.OK });
        } else {
          logger.warn(`OTP verification failed for INN: ${data.INN} from server: ${req.servername} - ${isOtpValid}`);
          return res.status(400).json({ success: false, message: isOtpValid, status: statusCodes.OTP_VERIFICATION_FAILED });
        }
      } else {
        logger.warn(`Invalid Chat ID for INN: ${data.INN} from server: ${req.servername}`);
        return res.status(400).json({ success: false, message: 'Invalid Chat ID', status: statusCodes.INVALID_CHAT_ID });
      }
    } catch (error) {
      logger.error(`Error while verifying INN: ${data.INN} from server: ${req.servername} - ${error.message}`);
      // console.error('Error while verifying INN:', error);
      return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async createOTP(req, res) {
    try {
      const { INN, expiry, message } = req.body;
      const expiryInSec = expiry || 180;
      const expiryDate = new Date(Date.now() + expiryInSec * 1000);

      let chatId;
      let user;

      try {
        const req_data = await UserServices.findByINN(INN);
        if (!req_data?.user) {
          logger.warn(`User not found for INN: ${INN} from server: ${req.servername}`);
          return res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
        }
        if (!req_data.user.loggedIn) {
          logger.warn(`Forbidden action - user not logged in (no activated) for INN: ${INN} from server: ${req.servername}`);
          res.status(403).json({ message: statusCodes.FORBIDDEN.message, status: statusCodes.FORBIDDEN });
          return;
        }
        chatId = req_data.user.ChatID;
        user = req_data.user;
      } catch (error) {
        logger.error(`Error finding the user for INN: ${INN} from server: ${req.servername} - ${error.message}`);
        // console.error('Error finding the user:', error);
        return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
      }

      if (chatId) {
        const secret = speakeasy.generateSecret({ length: 6 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });

        try {
          await OTPServices.createOTP({ User_id: user.id, otp: code, expiry: expiryDate });

          const send = `${message ? message : ''}\nYour OTP code is: ${code}`;
          await sendMessage(chatId, send);

          logger.info(`OTP created and sent for INN: ${INN} from server: ${req.servername}`);
          res.status(200).json({ otp: code, expiry: expiryDate, status: statusCodes.OTP_SENT });
        } catch (error) {
          logger.error(`Error sending message or creating OTP for INN: ${INN} from server: ${req.servername} - ${error.message}`);
          // console.error('Error sending message or creating OTP:', sendError);
          res.status(500).json({ error: statusCodes.FAILED_TO_SEND_OTP.message, status: statusCodes.FAILED_TO_SEND_OTP });
        }
      } else {
        logger.warn(`Chat ID does not exist for user with INN: ${INN} from server: ${req.servername}`);
        // console.error('Chat ID is not set for the user.');
        res.status(400).json({ error: "Chat ID doesn't exist", status: statusCodes.INVALID_CHAT_ID });
      }
    } catch (error) {
      logger.error(`Error generating OTP for INN: ${INN} from server: ${req.servername} - ${error.message}`);
      // console.error('Error generating OTP:', error);
      res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async VerifyOTP(req, res) {
    const data = {
      INN: req.body.INN,
      otp: req.body.otp,
    };

    try {
      const req_data = await UserServices.findByINN(data.INN);
      const User_id = req_data.user.id;
      const isOtpValid = await OTPServices.verifyOtp(User_id, data.otp);

      if (isOtpValid === 'success') {
        logger.info(`OTP verified successfully for INN: ${data.INN} from server: ${req.servername}`);
        return res.status(200).json({ success: true, status: statusCodes.OK });
      } else {
        logger.warn(`OTP verification failed for INN: ${data.INN} from server: ${req.servername} - ${isOtpValid}`);
        return res.status(400).json({ success: false, message: isOtpValid, status: statusCodes.OTP_VERIFICATION_FAILED });
      }
    } catch (error) {
      logger.error(`Error while verifying OTP for INN: ${data.INN} from server: ${req.servername} - ${error.message}`);
      // console.error('Error while verifying INN:', error);
      return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }
}

module.exports = UserController;
