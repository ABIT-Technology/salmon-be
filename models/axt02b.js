"use strict";
const { Model } = require("sequelize");
// require("sequelize").DATE.prototype._stringify = function _stringify(
// 	date,
// 	options,
// ) {
// 	date = this._applyTimezone(date, options);
// 	// Z here means current timezone, _not_ UTC
// 	// return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
// 	return date.format("YYYY-MM-DD HH:mm:ss.SSS");
// };
module.exports = (sequelize, DataTypes) => {
	class AXT02B extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	AXT02B.init(
		{
			ID2: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
			},
			ID1: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: false,
			},
			CUTI_: {
				type: DataTypes.STRING,
				defaultValue: "",
				allowNull: false,
				unique: false,
			},
			TGL: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			WKT1: {
				type: DataTypes.DATE,
			},
			WKT2: {
				type: DataTypes.DATE,
			},
			HARI: {
				type: DataTypes.FLOAT,
				defaultValue: 0,
			},
			KET: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			CUTI_KE: {
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
		},
		{
			sequelize,
			modelName: "AXT02B",
			timestamps: false,
			freezeTableName: true,
			validate: true,
		},
	);
	return AXT02B;
};
