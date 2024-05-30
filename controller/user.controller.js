const speakeasy = require("speakeasy");
const bot = require("../bot");

class UserController {
  async createUser(req, res) {
    const { userId, inn, phoneNumber } = req.body; // Expect userId in request body
    try {
      const secret = speakeasy.generateSecret({ length: 6 });

      const code = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
      });

      // bot.on("", (res) => {
      //   console.log(res);
      // });

      // const createdUser = { id: 1, inn: inn };

      const message = `Password: ${code}`;

      //   if (true == false) {
      //     // Check if chatId is available for this user
      //     await bot.sendMessage(chatId, message);
      //   } else {
      //     console.error(`Chat ID for user ID: ${userId} is not set.`);
      //   }

      // res.status(201).json(createdUser);
      res.status(200).json("hekki");
    } catch (error) {
      console.error("Error creating user:", error);
      //   res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new UserController();
