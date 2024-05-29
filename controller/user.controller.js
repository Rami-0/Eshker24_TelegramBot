const speakeasy = require("speakeasy");
const bot = require("../bot");

let userChatIds = {}; // In-memory storage for user chat IDs

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(
    `Received /start command from user ID: ${userId} with chat ID: ${chatId}`
  );
  userChatIds[userId] = chatId; // Store the chat ID for this user
  bot.sendMessage(chatId, "Welcome! Your chat ID has been saved.");
});

class UserController {
  async createUser(req, res) {
    const { userId, inn, phoneNumber } = req.body; // Expect userId in request body
    try {
      const secret = speakeasy.generateSecret({ length: 6 });

      const code = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
      });

      const createdUser = { id: 1, inn: inn };

      const message = `Password: ${code}`;

      const chatId = userChatIds[userId];
      if (chatId) {
        // Check if chatId is available for this user
        await bot.sendMessage(chatId, message);
      } else {
        console.error(`Chat ID for user ID: ${userId} is not set.`);
      }

      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new UserController();
