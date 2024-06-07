// ./db/models/allowedservers.js
'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // Include bcrypt for password hashing

module.exports = (sequelize, DataTypes) => {
  class AllowedServers extends Model {
    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      this.encryptedKey = await bcrypt.hash(password, salt);
    }
  }

  AllowedServers.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    encryptedKey: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AllowedServers',
  });

  // Add a hook before create to hash the password
  AllowedServers.addHook('beforeCreate', async (server) => {
    await server.hashPassword(server.encryptedKey);
  });

  return AllowedServers;
};