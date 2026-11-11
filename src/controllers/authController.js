const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur, Role } = require('../models');

exports.inscription = async (req, res) => {
  const { nom, prenom, email, motDePasse } = req.body;
  // Une inscription publique ne peut jamais choisir un rôle privilégié.
  const role = await Role.findOne({ where: { nom: 'Etudiant' } });
  if (!role) return res.status(500).json({ message: 'Rôle Etudiant absent. Exécutez npm run db:seed.' });
  const utilisateur = await Utilisateur.create({ nom, prenom, email, motDePasse, roleId: role.id });
  res.status(201).json({ message: 'Compte étudiant créé. Faites compléter votre profil par un administrateur.', utilisateur });
};

exports.connexion = async (req, res) => {
  const { email, motDePasse } = req.body;
  const utilisateur = await Utilisateur.scope('avecMotDePasse').findOne({
    where: { email }, include: [{ model: Role, as: 'role' }]
  });
  if (!utilisateur || !(await bcrypt.compare(motDePasse, utilisateur.motDePasse))) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }
  const token = jwt.sign(
    { id: utilisateur.id, role: utilisateur.role.nom },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
  const data = utilisateur.toJSON();
  delete data.motDePasse;
  res.json({ message: 'Connexion réussie.', token, utilisateur: data });
};
