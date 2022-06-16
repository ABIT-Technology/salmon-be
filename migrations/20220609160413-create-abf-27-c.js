"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("ABF27C", {
			ID3: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			USERID: {
				type: Sequelize.INTEGER,
			},
			TGL: {
				type: Sequelize.DATE,
			},
			CIN: {
				type: Sequelize.DATE,
			},
			COUT: {
				type: Sequelize.DATE,
			},
			JABSEN: {
				type: Sequelize.STRING,
			},
			KET: {
				type: Sequelize.TEXT,
			},
			IDK: {
				type: Sequelize.INTEGER,
			},
			USER_INPUT: {
				type: Sequelize.STRING,
			},
			TGL_INPUT: {
				type: Sequelize.DATE,
			},
			USER_UPDATE: {
				type: Sequelize.STRING,
			},
			TGL_UPDATE: {
				type: Sequelize.DATE,
			},
			ID_MESIN: {
				type: Sequelize.INTEGER,
			},
			ID_REF: {
				type: Sequelize.INTEGER,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("ABF27C");
	},
};
