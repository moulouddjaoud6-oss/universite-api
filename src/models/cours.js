const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('Cours', {
  code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  credits: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 30 } },
  professeurId: { type: DataTypes.INTEGER, allowNull: false },
  departementId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'cours' });
