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
	class LOGINSALMON2 extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	LOGINSALMON2.init(
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
			ACC_NO: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			DEVICE_ID: {
				type: DataTypes.STRING,
				defaultValue: "",
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
			ALTITUDE: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			ACCURATE: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			LOKASI: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
			KET: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
		},
		{
			sequelize,
			modelName: "LOGINSALMON2",
			timestamps: false,
			freezeTableName: true,
			tableName: "LOGINSALMON2",
		},
	);
	return LOGINSALMON2;
};
