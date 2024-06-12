// migrations/create-temp_users.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('TempUsers', {
      id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
      chatId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      lang: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('TempUsers');
	},
};
