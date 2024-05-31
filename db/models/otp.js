'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    expiry: {
      type: DataTypes.DATE, // Assuming this is the expiry date for the OTP
      allowNull: true,
    },
    status_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    CurrentTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    User_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  OTP.associate = function(models) {
    OTP.belongsTo(models.User, { foreignKey: 'User_id' });
  };

  return OTP;
};
