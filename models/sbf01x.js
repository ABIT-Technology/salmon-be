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
	class SBF01X extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SBF01X.init(
		{
			ID1: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			TGL: {
				type: DataTypes.DATE,
			},
			SALMON2_ID: {
				type: DataTypes.STRING,
			},
			ACC_NO: {
				type: DataTypes.STRING,
			},
			VALID: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			APP: {
				type: DataTypes.BOOLEAN,
			},
			APP_BY: {
				type: DataTypes.STRING,
			},
			APP_TGL: {
				type: DataTypes.DATE,
			},
			REJECT: {
				type: DataTypes.BOOLEAN,
			},
			REJECT_BY: {
				type: DataTypes.STRING,
			},
			REJECT_TGL: {
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: "SBF01X",
			timestamps: false,
			freezeTableName: true,
			tableName: "SBF01X",
		},
	);
	return SBF01X;
};
