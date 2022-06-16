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
	class ABF27B extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	ABF27B.init(
		{
			ID2: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			ID_REF: {
				type: DataTypes.INTEGER,
			},
			ID_MESIN: {
				type: DataTypes.INTEGER,
			},
			TGL: {
				type: DataTypes.DATE,
			},
			WKT: {
				type: DataTypes.DATE,
			},
			IDK: {
				type: DataTypes.INTEGER,
			},
			USERID: {
				type: DataTypes.INTEGER,
			},
			JABSEN: {
				type: DataTypes.STRING,
			},
			KET: {
				type: DataTypes.TEXT,
			},
			USER_INPUT: {
				type: DataTypes.STRING,
			},
			TGL_INPUT: {
				type: DataTypes.DATE,
			},
			PROSES: {
				type: DataTypes.BOOLEAN,
			},
		},
		{
			sequelize,
			modelName: "ABF27B",
			timestamps: false,
			freezeTableName: true,
		},
	);
	return ABF27B;
};
