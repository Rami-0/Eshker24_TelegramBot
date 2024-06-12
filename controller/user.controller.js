const speakeasy = require('speakeasy');
const UserServices = require('../services/user');
const OTPServices = require('../services/otp');
const { sendMessage } = require('../api/api');
const base64 = require('base-64');
const { statusCodes } = require('../constants/statusCode');

class UserController {
  static async DeleteUserConnection(req, res) {
    try {
      const { INN, Chat_ID } = req.body;
      const req_data = await UserServices.findByINN(INN);
      if (!req_data) {
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      } else if (req_data.user.ChatID!== Chat_ID) {
        res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
        return;
      } else {
        await UserServices.DeleteUserConnection(INN, Chat_ID);
        res.status(200).json({ status: statusCodes.USER_DELETED });
        return;
      }
    } catch (error) {
      res.status(400).json({ status: statusCodes.USER_NOT_FOUND });
      return;
    }
  }

  static async setAuth(req, res) {
    try {
      const { INN, chatId } = req.body;
      const req_data = await UserServices.findByINN(INN);
      console.log(req_data.message)
      if (!req_data) {
        const secret = speakeasy.generateSecret({ length: 8 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });
        const expiryInSec = 1000;
        const expiryDate = new Date(Date.now() + expiryInSec * 1000);
        const CreateUnregisterdUser = await UserServices.CreateUserWithINN(INN, chatId, code, expiryDate);
        res.status(200).json({ ...CreateUnregisterdUser, status: statusCodes.UNREGISTERED_USER_CREATED });
        return;
      } else if (req_data.message && req_data.user.ChatID == chatId) {
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
        res.status(200).json({ ...data, status: statusCodes.OK });
        return;
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
          return res.status(200).json({ success: true, status: statusCodes.OK });
        } else {
          return res.status(400).json({ success: false, message: isOtpValid, status: statusCodes.OTP_VERIFICATION_FAILED });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Invalid Chat ID', status: statusCodes.INVALID_CHAT_ID });
      }
    } catch (error) {
      console.error('Error while verifying INN:', error);
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
          return res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
        }
        if (!req_data.user.loggedIn) {
          res.status(403).json({ message: statusCodes.FORBIDDEN.message, status: statusCodes.FORBIDDEN });
          return;
        }
        if (req_data && req_data.user) {
          chatId = req_data.user.ChatID;
          user = req_data.user;
        } else {
          return res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
        }
      } catch (error) {
        console.error('Error finding the user:', error);
        return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
      }

      if (chatId) {
        const secret = speakeasy.generateSecret({ length: 6 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: 'base32',
        });

        try {
          const AddOtp = await OTPServices.createOTP({ User_id: user.id, otp: code, expiry: expiryDate });

          const send = `${message ? message : ''}\nYour OTP code is: ${code}`;

          await sendMessage(chatId, send);

          res.status(200).json({ otp: code, expiry: expiryDate, status: statusCodes.OTP_SENT });
        } catch (sendError) {
          console.error('Error sending message or creating OTP:', sendError);
          res.status(500).json({ error: statusCodes.FAILED_TO_SEND_OTP.message, status: statusCodes.FAILED_TO_SEND_OTP });
        }
      } else {
        console.error('Chat ID is not set for the user.');
        res.status(400).json({ error: "Chat ID doesn't exist", status: statusCodes.INVALID_CHAT_ID });
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async init(req, res) {
    const userData = {
      INN: req.body.INN,
      Auth: req.body.pin
    };
    try {
      const send = await UserServices.createUser(userData);
      console.log(send);
      res.status(200).json({ success: 'User created successfully', status: statusCodes.OK });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message, status: statusCodes.INTERNAL_SERVER_ERROR });
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
        return res.status(200).json({ success: true, status: statusCodes.OK });
      } else {
        return res.status(400).json({ success: false, message: isOtpValid, status: statusCodes.OTP_VERIFICATION_FAILED });
      }
    } catch (error) {
      console.error('Error while verifying INN:', error);
      return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async registerUser(req, res) {
    console.log(req.body);
    const userData = {
      INN: req.body.INN,
      password: req.body.password,
      chatId: req.body.chatId,
      lang: req.body.lang,
    };
    let user;
    try {
      const req_data = await UserServices.findByINN(userData.INN);
      if (req_data) {
        user = req_data.user;
        const Auth = req_data.user?.Auth;
        if (Auth !== userData.password) {
          res.status(401).json({ error: statusCodes.INVALID_PASSWORD.message, status: statusCodes.INVALID_PASSWORD });
          return;
        }
      } else {
        res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
        return;
      }

      try {
        user.lang = userData.lang;
        user.loggedIn = true;
        await UserServices.assignChatID(user, userData.chatId);
        res.status(200).json({ success: statusCodes.USER_REGISTERED.message, status: statusCodes.USER_REGISTERED });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message, status: statusCodes.INTERNAL_SERVER_ERROR });
      }
    } catch (err) {
      console.error('Error while verifying INN:', err);
      res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async checkIfUserHasRegisteredChat(req, res) {
    const { chatId } = req.query;
    try {
      const req_data = await UserServices.findByChatID(chatId);
      if (req_data && req_data.ChatID) {
        return res.status(200).json({ success: true, status: statusCodes.OK });
      } else {
        return res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
      }
    } catch (error) {
      console.error('Error finding the user:', error);
      return res.status(500).json({ error: statusCodes.INTERNAL_SERVER_ERROR.message, status: statusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  static async updatePassword(req, res) {
    const { INN, password, repeatPassword } = req.body;
    try {
      const req_data = await UserServices.updatePassword(INN, password, repeatPassword);
      if (req_data) {
        return res.status(200).json({ success: true, status: statusCodes.PASSWORD_UPDATED });
      } else {
        return res.status(404).json({ error: statusCodes.USER_NOT_FOUND.message, status: statusCodes.USER_NOT_FOUND });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message, status: statusCodes.INTERNAL_SERVER_ERROR });
      return;
    }
  }
}

module.exports = UserController;
