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
	class LOGINHISTORY extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	LOGINHISTORY.init(
		{
			ID1: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			ACC_NO: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			DEVICE_ID: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			TYPE: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
			TGL: {
				type: DataTypes.DATE,
			},
			TGL_INPUT: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			TGL_UPDATE: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			KET: {
				type: DataTypes.TEXT,
				defaultValue: "",
			},
		},
		{
			sequelize,
			modelName: "LOGINHISTORY",
			timestamps: false,
			freezeTableName: true,
			tableName: "LOGIN_HISTORY",
		},
	);
	return LOGINHISTORY;
};
