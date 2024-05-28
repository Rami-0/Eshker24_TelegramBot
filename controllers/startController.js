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

module.exports = {
  startMessage,
};
