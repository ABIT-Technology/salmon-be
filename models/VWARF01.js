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
	class ABF27C extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	ABF27C.init(
		{
			ID3: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			USERID: {
				type: DataTypes.INTEGER,
			},
			TGL: {
				type: DataTypes.DATE,
			},
			CIN: {
				type: DataTypes.DATE,
			},
			COUT: {
				type: DataTypes.DATE,
			},
			JABSEN: {
				type: DataTypes.STRING,
			},
			KET: {
				type: DataTypes.TEXT,
			},
			IDK: {
				type: DataTypes.INTEGER,
			},
			USER_INPUT: {
				type: DataTypes.STRING,
			},
			TGL_INPUT: {
				type: DataTypes.DATE,
			},
			USER_UPDATE: {
				type: DataTypes.STRING,
			},
			TGL_UPDATE: {
				type: DataTypes.DATE,
			},
			ID_MESIN: {
				type: DataTypes.INTEGER,
			},
			ID_REF: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "ABF27C",
			timestamps: false,
			freezeTableName: true,
		},
	);
	return ABF27C;
};
