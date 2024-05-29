'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
