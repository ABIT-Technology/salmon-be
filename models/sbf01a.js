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
	class SBF01A extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SBF01A.init(
		{
			ID1: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			IDK: {
				allowNull: false,
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			ACC_NO: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			PRIV_ID: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			ACC_AKTIF: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			AKTIF: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			TGL_INPUT: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			USER_INPUT: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			TGL_UPDATE: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			USER_UPDATE: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			DEVICE_ID: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			ACCOUNT_ID: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			STATUSA: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			SEGMENT: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
		},
		{
			sequelize,
			modelName: "SBF01A",
			timestamps: false,
			freezeTableName: true,
		},
	);
	return SBF01A;
};
