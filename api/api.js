const axios = require('axios');
const token = process.env.TG_TOKEN; 

const $telegram = axios.create({
  baseURL: `https://api.telegram.org/bot${token}/`,
});


module.exports =  {
  sendMessage: async (chatId, message) => {
    try {
      await $telegram.post('sendMessage', {
        chat_id: chatId,
        text: message,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },
};