'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        ChatID: null,
        INN: "20203123010310",
        Auth: "MTIzNDoxMjM0",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ChatID: null,
        INN: "20203123010220",
        Auth: "MTIzNDoxMjM0",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ChatID: null,
        INN: "22210200350080",
        Auth: "MTIzNDoxMjM0",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ChatID: null,
        INN: "20203123010550",
        Auth: "MTIzNDoxMjM0",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
