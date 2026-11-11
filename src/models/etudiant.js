const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Etudiant = sequelize.define('Etudiant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_naissance'
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'utilisateur_id'
    }
  }, {
    tableName: 'etudiants',
    timestamps: true,
    underscored: true
  });

  return Etudiant;
};