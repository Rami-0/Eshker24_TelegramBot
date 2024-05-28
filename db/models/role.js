'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    userId: DataTypes.INTEGER
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
    Role.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Role;
};
