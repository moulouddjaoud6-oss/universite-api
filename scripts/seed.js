require('dotenv').config();

const bcrypt = require('bcryptjs');

const {
  sequelize,
  Role,
  Utilisateur,
  Etudiant
} = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();

    // Création des rôles
    for (const [nom, description] of [
      ['Administrateur', 'Accès complet à la gestion'],
      ['Professeur', 'Gestion pédagogique'],
      ['Etudiant', 'Consultation des informations étudiantes']
    ]) {
      await Role.findOrCreate({
        where: { nom },
        defaults: { description }
      });
    }

    // Création du compte administrateur
    const adminRole = await Role.findOne({
      where: { nom: 'Administrateur' }
    });

    const adminHash = await bcrypt.hash('Admin12345!', 12);

    await Utilisateur.findOrCreate({
      where: { email: 'admin@universite.local' },
      defaults: {
        nom: 'Admin',
        prenom: 'Principal',
        email: 'admin@universite.local',
        motDePasse: adminHash,
        roleId: adminRole.id
      }
    });

    // Création du compte étudiant
    const etudiantRole = await Role.findOne({
      where: { nom: 'Etudiant' }
    });

    const studentHash = await bcrypt.hash('Ahmed12345!', 12);

    const [utilisateur] = await Utilisateur.findOrCreate({
      where: { email: 'ahmed.benali@test.com' },
      defaults: {
        nom: 'Benali',
        prenom: 'Ahmed',
        email: 'ahmed.benali@test.com',
        motDePasse: studentHash,
        roleId: etudiantRole.id
      }
    });

    // Création du profil étudiant
    await Etudiant.findOrCreate({
      where: { matricule: 'ETU2026001' },
      defaults: {
        matricule: 'ETU2026001',
        utilisateurId: utilisateur.id,
        dateNaissance: '2004-05-15',
        telephone: '0612345678',
        adresse: 'Paris'
      }
    });

    console.log('Données initiales créées avec succès !');
    console.log('Compte étudiant : ahmed.benali@test.com');
    console.log('Mot de passe : Ahmed12345!');

    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();