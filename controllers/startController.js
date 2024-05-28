const startMessage = (bot, chatId, name) => {
  const keyboard = {
    inline_keyboard: [
      [{ text: "Info 🎖", callback_data: "inf" }],
      [{ text: "How to get debit Card", callback_data: "card" }],
    ],
  };

  bot.sendMessage(chatId, ``, {
    reply_markup: keyboard,
  });
};

module.exports = {
  startMessage,
};
