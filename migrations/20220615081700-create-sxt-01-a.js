"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("SXT01A", {
			ID1: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			IDK: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			LAT_: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			LONG_: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			COURSE: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			SPEED: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			TGL: {
				type: Sequelize.DATE,
			},
			TGL_INPUT: {
				type: Sequelize.DATE,
				defaultValue: new Date(),
			},
			SIGNAL: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			BATTERY: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			KET: {
				type: Sequelize.TEXT,
				defaultValue: "",
			},
			COY_ID: {
				type: Sequelize.STRING,
				defaultValue: "",
			},
			VISIT_ID: {
				type: Sequelize.STRING,
				defaultValue: "",
			},
			TYPE: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			ALTITUDE: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			ACCURATE: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			CUST: {
				type: Sequelize.STRING,
				defaultValue: "",
			},
			LOKASI: {
				type: Sequelize.TEXT,
				defaultValue: "",
			},
			ID1_REF: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("SXT01A");
	},
};
