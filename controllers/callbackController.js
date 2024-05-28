const startController = require("./startController");

const handleCallbackQuery = (bot, callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const data = callbackQuery.data;

  let responseText;

  switch (data) {
    case "inf":
      responseText = "Here is the information you requested!";
      break;
    case "card":
      responseText = "Here is how you can get a debit card!";
      break;
    case "support":
      responseText = "Support is on its way!";
      break;
    case "settings":
      responseText = "Here are your settings options.";
      break;
    case "faq":
      responseText = "Here are the frequently asked questions.";
      break;
    case "contact":
      responseText = "You can contact us at contact@example.com.";
      break;
    default:
      responseText = "Unknown selection!";
  }

  bot
    .sendMessage(chatId, responseText)
    // .then(() => {
    //   startController.startMessage(bot, chatId, message.from.first_name);
    // })
    .catch((error) => {
      console.error("Error sending response message:", error);
    });
};

module.exports = {
  handleCallbackQuery,
};
