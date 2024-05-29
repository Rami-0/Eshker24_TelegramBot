'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Transactions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			INN: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			PhoneNumber: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			OTP: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			OTPTime: {
				type: Sequelize.INTEGER,
				allowNull: true,
				validate: {
					isInt: true, // Checks if the value is an integer
					min: 1, // Ensures the value is at least 1 (positive integer)
				},
			},
			CurrentTime: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			Status: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('Transactions');
	},
};
