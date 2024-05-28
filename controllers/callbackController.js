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

  if (responseText) {
    bot
      .sendMessage(chatId, responseText)
      .then(() => {
        startController.startMessage(bot, chatId, message.from.first_name);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
};

module.exports = {
  handleCallbackQuery,
};
