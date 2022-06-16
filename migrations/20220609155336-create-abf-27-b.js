"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("ABF27B", {
			ID2: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			ID_REF: {
				type: Sequelize.INTEGER,
			},
			ID_MESIN: {
				type: Sequelize.INTEGER,
			},
			TGL: {
				type: Sequelize.DATE,
			},
			WKT: {
				type: Sequelize.DATE,
			},
			IDK: {
				type: Sequelize.INTEGER,
			},
			USERID: {
				type: Sequelize.INTEGER,
			},
			JABSEN: {
				type: Sequelize.STRING,
			},
			KET: {
				type: Sequelize.TEXT,
			},
			USER_INPUT: {
				type: Sequelize.STRING,
			},
			TGL_INPUT: {
				type: Sequelize.DATE,
			},
			PROSES: {
				type: Sequelize.BOOLEAN,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("ABF27B");
	},
};
