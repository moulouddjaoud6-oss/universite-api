const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('Note', {
  note: { type: DataTypes.DECIMAL(5, 2), allowNull: false, validate: { min: 0, max: 100 } },
  appreciation: { type: DataTypes.STRING(255) },
  inscriptionId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
}, { tableName: 'notes' });
