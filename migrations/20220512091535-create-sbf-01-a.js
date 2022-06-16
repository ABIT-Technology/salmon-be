"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("SBF01A", {
			ID1: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			IDK: {
				type: Sequelize.INTEGER,
			},
			ACC_NO: {
				type: Sequelize.STRING,
			},
			PRIV_ID: {
				type: Sequelize.INTEGER,
			},
			ACC_AKTIF: {
				type: Sequelize.INTEGER,
			},
			AKTIF: {
				type: Sequelize.INTEGER,
			},
			TGL_INPUT: {
				type: Sequelize.DATE,
			},
			USER_INPUT: {
				type: Sequelize.STRING,
			},
			TGL_UPDATE: {
				type: Sequelize.DATE,
			},
			USER_UPDATE: {
				type: Sequelize.STRING,
			},
			DEVICE_ID: {
				type: Sequelize.STRING,
			},
			ACCOUNT_ID: {
				type: Sequelize.STRING,
			},
			STATUSA: {
				type: Sequelize.INTEGER,
			},
			SEGMENT: {
				type: Sequelize.STRING,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("SBF01A");
	},
};
