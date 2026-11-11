const sequelize = require('../config/database');
const Role = require('./role');
const Utilisateur = require('./utilisateur');
const Etudiant = require('./etudiant')(sequelize);
const Departement = require('./departement');
const Professeur = require('./professeur');
const Cours = require('./cours');
const Inscription = require('./inscription');
const Note = require('./note');

Role.hasMany(Utilisateur, { foreignKey: 'roleId', as: 'utilisateurs' });
Utilisateur.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Utilisateur.hasOne(Etudiant, { foreignKey: 'utilisateurId', as: 'profilEtudiant' });
Etudiant.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
Utilisateur.hasOne(Professeur, { foreignKey: 'utilisateurId', as: 'profilProfesseur' });
Professeur.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });

Departement.hasMany(Professeur, { foreignKey: 'departementId', as: 'professeurs' });
Professeur.belongsTo(Departement, { foreignKey: 'departementId', as: 'departement' });
Departement.hasMany(Cours, { foreignKey: 'departementId', as: 'cours' });
Cours.belongsTo(Departement, { foreignKey: 'departementId', as: 'departement' });
Professeur.hasMany(Cours, { foreignKey: 'professeurId', as: 'cours' });
Cours.belongsTo(Professeur, { foreignKey: 'professeurId', as: 'professeur' });

Etudiant.hasMany(Inscription, { foreignKey: 'etudiantId', as: 'inscriptions' });
Inscription.belongsTo(Etudiant, { foreignKey: 'etudiantId', as: 'etudiant' });
Cours.hasMany(Inscription, { foreignKey: 'coursId', as: 'inscriptions' });
Inscription.belongsTo(Cours, { foreignKey: 'coursId', as: 'cours' });
Inscription.hasOne(Note, { foreignKey: 'inscriptionId', as: 'note' });
Note.belongsTo(Inscription, { foreignKey: 'inscriptionId', as: 'inscription' });

module.exports = {
  sequelize, Role, Utilisateur, Etudiant, Professeur,
  Departement, Cours, Inscription, Note
};
