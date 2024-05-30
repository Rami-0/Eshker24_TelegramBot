const Promise = require("bluebird");
const TelegramBot = require("node-telegram-bot-api");
const UserServices = require("./services/user");
require("dotenv").config();

Promise.config({
  cancellation: true,
});

TelegramBot.Promise = Promise;

const TOKEN = process.env.TG_TOKEN;
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome! Please share your phone number.");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "" || !/^\+?\d{10,15}$/.test(msg.text)) {
    bot.sendMessage(chatId, "Please share a valid phone number.");
    return;
  }

  try {
    const user = await UserServices.findByINNOrPhoneNumber(msg.text);

    if (user.user && !user.message) {
      const updatedUser = await UserServices.assignChatID(user, chatId);

      if (updatedUser) {
        bot.sendMessage(chatId, `Chat ID assigned. Phone Number: ${updatedUser.PhoneNumber}`);
      } else {
        bot.sendMessage(chatId, "Failed to assign chat ID.");
      }
    }
    else if( user.message ) {
      bot.sendMessage(chatId, user.message);
      //TODO : check the validity of the INN with the phone number
    }
    else {
      bot.sendMessage(chatId, "User not found.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "An error occurred. Please try again.");
  }
});

bot.getMe().then((me) => {
  console.log(`Bot ${me.username} is up and running...`);
});

module.exports = bot;
