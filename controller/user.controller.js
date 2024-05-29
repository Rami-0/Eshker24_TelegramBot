const db = require("../db/db");
const bot = require("../bot");
const speakeasy = require("speakeasy");

bot
  .getUpdates()
  .then((updates) => {
    if (updates && updates.length > 0) {
      // Get the chatId from the first update
      const chatId = updates[0].message.chat.id;
      console.log("Chat ID:", chatId);
    } else {
      console.log("No updates found.");
    }
  })
  .catch((error) => {
    console.error("Error getting updates:", error);
  });
class UserController {
  async createUser(req, res) {
    const { inn, phoneNumber } = req.body;
    try {
      // const newUser = await db.query(`
      // INSERT INTO users (name) VALUES ($1) RETURNING *`,
      // [name]
      // );
      // const createdUser = newUser.rows[0];

      const secret = speakeasy.generateSecret({ length: 6 });

      // Generate a TOTP code using the secret key
      const code = speakeasy.totp({
        // Use the Base32 encoding of the secret key
        secret: secret.base32,

        // Tell Speakeasy to use the Base32
        // encoding format for the secret key
        encoding: "base32",
      });

      // Log the secret key and TOTP code
      // to the console
      //   console.log("Secret: ", secret.base32);

      //   console.log("Code: ", code);

      const createdUser = { id: 1, inn: inn };

      const chatId = process.env.TG_CHAT_ID;
      const message = `Password: ${code}`;

      //   await bot.sendMessage(chatId, message);

      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new UserController();
