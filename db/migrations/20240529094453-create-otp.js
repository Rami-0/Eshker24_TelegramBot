'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('OTPs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			User_id: {
				type: Sequelize.STRING,
			},
			otp: {
				type: Sequelize.STRING,
			},
			expiry: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			CurrentTime: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			status_flag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('OTPs');
	},
};
