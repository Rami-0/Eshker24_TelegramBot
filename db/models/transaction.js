'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    INN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    OTP: {
      type: DataTypes.STRING,
      allowNull: true
    },
    OTPTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CurrentTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  
  Transaction.associate = function(models) {

  };
  
  return Transaction;
};
