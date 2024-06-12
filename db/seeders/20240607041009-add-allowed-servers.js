'use strict';

const bcrypt = require('bcryptjs'); // Include bcrypt for password hashing

const allowedUsers = {
  'M-I': 'b1a90968-1c37-427b-966c-b95858155e78',
  'P-I': 'aa1b11c7-1d2c-4b36-8be3-9ebf39033aa4',
  'M-R': '8c65ac8a-fdf8-4329-a608-7099b4f9406e',
  'P-R': '13009ab7-6273-4e32-952d-745682ce4aba'
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = Object.entries(allowedUsers).map(async ([username, password]) => {
      const salt = await bcrypt.genSalt(10); // Generate a salt for each password
      const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
      return {
        username,
        encryptedKey: hashedPassword, // Store the hashed password
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Wait for all promises to resolve before inserting
    const resolvedUsers = await Promise.all(users);
    await queryInterface.bulkInsert('AllowedServers', resolvedUsers, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AllowedServers', null, {});
  }
};