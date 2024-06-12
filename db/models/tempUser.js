// ./tempUser.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const TempUser = sequelize.define('TempUser', { // Note the capitalization here
    chatId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  }, {tableName: 'TempUsers'});

  TempUser.associate = function(models) {
    // Define associations here
  };

  return TempUser;
};
