const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('Inscription', {
  dateInscription: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  statut: { type: DataTypes.ENUM('active', 'annulee', 'terminee'), allowNull: false, defaultValue: 'active' },
  etudiantId: { type: DataTypes.INTEGER, allowNull: false },
  coursId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'inscriptions', indexes: [{ unique: true, fields: ['etudiant_id', 'cours_id'] }] });
