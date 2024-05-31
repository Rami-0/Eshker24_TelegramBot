'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    OTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiry: {
      type: DataTypes.DATE, // min
      allowNull: true,
    },
    CurrentTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {});

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, { foreignKey: 'User_id' });
  };

  return Transaction;
};
