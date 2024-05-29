'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ChatID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    INN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Transaction, { foreignKey: 'User_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    User.hasMany(models.Transaction, { foreignKey: 'User_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };

  return User;
};
