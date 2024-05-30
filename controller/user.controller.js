const speakeasy = require("speakeasy");
const bot = require("../bot");
const UserServices = require("../services/user");
const OTPServices = require("../services/otp");
class UserController {
  static async createOTP(req, res) {
    try {
      const { INN, PhoneNumber } = req.body;

      // Generate a TOTP code
      let chatId;
      try {
        const user = await UserServices.findByINNOrPhoneNumber(
          INN || PhoneNumber
        );
        if (user) {
          chatId = user.user.ChatID;
        } else {
          res.status(404).json({ error: "User not found" });
          return;
        }
      } catch (error) {
        console.error("Error finding the user:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (chatId) {
        const secret = speakeasy.generateSecret({ length: 6 });
        const code = speakeasy.totp({
          secret: secret.base32,
          encoding: "base32",
        });
        let id = await UserServices.getUserIdByINNorPhoneNumber( INN || PhoneNumber)
        const AddOtp = await OTPServices.createOTP({ User_id: id ,otp: code });

        const message = `Password: ${code}`;

        try {
          // Send message to the user
          await bot.sendMessage(chatId, message);
          res.status(200).json({ message, userID: AddOtp });
        } catch (sendError) {
          console.error("Error sending message:", sendError);
          res.status(500).json({ error: "Failed to send message" });
        }
      } else {
        console.error("Chat ID is not set for the user.");
        res.status(400).json({ error: "Chat ID doesn't exist" });
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async init(req, res) {
    const userData = {
      PhoneNumber: req.body.PhoneNumber,
      INN: req.body.INN,
    };
    try {
      const send = await UserServices.createUser(userData); // Use `await` to wait for the promise
      console.log(send);
      // bot.sendMessage(chatId, 'Chat created successfully');
      res.status(200).json({ success: "User created successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
      // bot.sendMessage(chatId, 'Chat not created');
    }
  }

  static async VerifyOTP(req ,res) {
    const data = {
      token: req.body.token,
      otp: req.body.otp
    }
    try {
      // Assuming you have a method to verify OTP
      const isOtpValid = await OTPServices.verifyOtp(data.token, data.otp); // Function to verify OTP for the user
  
      if (isOtpValid === 'success') {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error while verifying TOKEN:", error);
      throw error;
    }
    }
}

module.exports = UserController;
