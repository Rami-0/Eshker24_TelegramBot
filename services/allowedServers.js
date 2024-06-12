// services/allowedUser.js
const { AllowedServers } = require('../db/models'); // Import the AllowedUser model
const bcrypt = require('bcryptjs'); // Include bcrypt for password hashing

const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY || 'your-secure-secret-key';

class AllowedServersServices {
  // Verify if the user exists and the password matches
  static async verifyServers(username, password) {
    try {
      const user = await AllowedServers.findOne({ where: { username } });
      if (!user) {
        return false; // User not found
      }
      const isPasswordValid = await bcrypt.compare(password, user.encryptedKey);
      return isPasswordValid; // Check if password matches
    } catch (error) {
      console.error('Error during user verification:', error);
      throw new Error('Could not verify user');
    }
  }
  
  // Fetch all allowed users (for administrative or debugging purposes)
  static async getAllAllowedServers() {
    try {
      const users = await AllowedServers.findAll();
      return users;
    } catch (error) {
      console.error('Error fetching allowed users:', error);
      throw new Error('Could not fetch allowed users');
    }
  }
}

module.exports = AllowedServersServices;
