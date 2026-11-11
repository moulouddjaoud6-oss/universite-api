const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
module.exports = sequelize.define('Professeur', {
  specialite: { type: DataTypes.STRING(120) },
  telephone: { type: DataTypes.STRING(30) },
  adresse: { type: DataTypes.STRING(255) },
  photo: { type: DataTypes.STRING(255) },
  utilisateurId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  departementId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'professeurs' });
