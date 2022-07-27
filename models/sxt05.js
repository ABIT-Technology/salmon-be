"use strict";
const { Model } = require("sequelize");
require("sequelize").DATE.prototype._stringify = function _stringify(
	date,
	options,
) {
	date = this._applyTimezone(date, options);
	// Z here means current timezone, _not_ UTC
	// return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
	return date.format("YYYY-MM-DD HH:mm:ss.SSS");
};
module.exports = (sequelize, DataTypes) => {
	class SXT05 extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SXT05.init(
		{
			ID1: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			IDK: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			LAT_: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			LONG_: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			COURSE: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			SPEED: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			TGL: {
				type: DataTypes.DATE,
			},
			TGL_INPUT: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			SIGNAL: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			BATTERY: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			KET: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
			VISIT_ID: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			TYPE: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			ALTITUDE: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			ACCURATE: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			CUST: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			LOKASI: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
			ID1_REF: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			ID_: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			STATUS: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: "SXT05",
			timestamps: false,
			freezeTableName: true,
			tableName: "SXT05",
		},
	);
	return SXT05;
};
