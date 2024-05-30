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

  // Create options for the button
  const options = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: "Share Phone Number", request_contact: true }],
        [{ text: "Share INN" }],
      ],
      resize_keyboard: true,
    }),
  };

  bot.sendMessage(chatId, "Welcome! Please choose an option:", options);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);

  try {
    var user;
    if (msg?.contact) {
      user = await UserServices.findByINNOrPhoneNumber(
        msg.contact.phone_number
      );
    } else {
      user = await UserServices.findByINNOrPhoneNumber(msg.text);
    }

    if (user.user && !user.message) {
      const updatedUser = await UserServices.assignChatID(user.user, chatId);

      console.log(updatedUser);
      if (updatedUser) {
        bot.sendMessage(
          chatId,
          `Chat ID assigned. Phone Number: ${updatedUser.PhoneNumber}`
        );
      } else {
        bot.sendMessage(chatId, "Failed to assign chat ID.");
      }
    } else if (user.message) {
      bot.sendMessage(chatId, user.message);
      //TODO : check the validity of the INN with the phone number
    } else {
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

bot.on("inline_query", (query) => {
  const results = [
    {
      type: "article",
      id: "1",
      title: "Caps",
      input_message_content: { message_text: query.query.toUpperCase() },
    },
    {
      type: "article",
      id: "2",
      title: "Lowercase",
      input_message_content: { message_text: query.query.toLowerCase() },
    },
  ];
  bot.answerInlineQuery(query.id, results);
});

module.exports = bot;
