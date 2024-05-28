const startController = require("./startController");

const handleCallbackQuery = (bot, callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const data = callbackQuery.data;

  let responseText;

  switch (data) {
    case "inf":
      responseText = "INFO";
      break;
    case "card":
      responseText = "CARD";
      break;
    default:
      responseText = "Unknown selection!";
  }

  bot.sendMessage(chatId, responseText);

  startController.startMessage(bot, chatId, message.from.first_name);
};

module.exports = {
  handleCallbackQuery,
};
