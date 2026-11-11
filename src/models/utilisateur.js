const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  nom: { type: DataTypes.STRING(80), allowNull: false },
  prenom: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  motDePasse: { type: DataTypes.STRING(255), allowNull: false },
  photo: { type: DataTypes.STRING(255) },
  roleId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'utilisateurs',
  defaultScope: { attributes: { exclude: ['motDePasse'] } },
  scopes: { avecMotDePasse: { attributes: { include: ['motDePasse'] } } },
  hooks: {
    beforeCreate: async (utilisateur) => {
      if (utilisateur.motDePasse && !utilisateur.motDePasse.startsWith('$2')) {
        utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 12);
      }
    },
    beforeUpdate: async (utilisateur) => {
      if (utilisateur.changed('motDePasse') && utilisateur.motDePasse && !utilisateur.motDePasse.startsWith('$2')) {
        utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 12);
      }
    }
  }
});
module.exports = Utilisateur;
