// service/tempUser.js
const { TempUser } = require('../db/models'); // Import your TempUser model

class TempUserServices {

    static async addTempUser(chatId, lang) {
        try {
            // Check if the user already exists
            let tempUser = await TempUser.findOne({ where: { chatId } });
            
            if (tempUser) {
                // If the user exists, update the language
                tempUser.lang = lang;
                await tempUser.save();
                console.log(`Temporary user updated: ${chatId}`);
                return tempUser
            } else {
                // If the user does not exist, create a new record
                await TempUser.create({ chatId, lang });
                console.log(`Temporary user added: ${chatId}`);
                return tempUser
            }
        } catch (error) {
            console.error('Error adding/updating temporary user:', error);
        }
    }        
    static async removeTempUser(chatId) {
        try {
            const deletedRows = await TempUser.destroy({ where: { chatId } });
            console.log(`Temporary user removed: ${chatId}`);
            return deletedRows > 0;
        } catch (error) {
            console.error('Error removing temporary user:', error);
            return false;
        }
    }

    static async findByChatId(chatId) {
        try {
            const tempUser = await TempUser.findByPk(String(chatId));
            if(tempUser) {
                return tempUser;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error finding temporary user:', error);
            return null;
        }
    }
}

module.exports = TempUserServices;
