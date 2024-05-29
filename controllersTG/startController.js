const { buttons } = require("../constants/btns");

const startMessage = (bot, chatId, name) => {
  const keyboard = {
    inline_keyboard: [...buttons],
  };

  bot.sendMessage(chatId, `Hello ${name}! How can I assist you today?`, {
    reply_markup: {
      inline_keyboard: keyboard.inline_keyboard,
    },
    resize_keyboard: true,
    one_time_keyboard: true,
  });
};

const infoMessage = (bot, chatId, name) => {
  const keyboard = {
    inline_keyboard: [[{ text: "back to main menu", callback_data: "back" }]],
  };

  bot
    .sendMessage(chatId, "Information", {
      reply_markup: keyboard,
      resize_keyboard: true,
    })
    .catch((error) => {
      console.error("Error sending info message:", error);
    });
};

const back = (bot, chatId, name) => {
  const keyboard = {
    inline_keyboard: [...buttons],
  };

  bot.sendMessage(chatId, `Main menu`, {
    reply_markup: {
      inline_keyboard: keyboard.inline_keyboard,
    },
    resize_keyboard: true,
    one_time_keyboard: true,
  });
};

module.exports = {
  startMessage,
  infoMessage,
  back,
};
