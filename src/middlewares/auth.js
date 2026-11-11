const jwt = require('jsonwebtoken');
const { Utilisateur, Role } = require('../models');

async function authentifier(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Jeton manquant.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const utilisateur = await Utilisateur.findByPk(payload.id, { include: [{ model: Role, as: 'role' }] });
    if (!utilisateur) return res.status(401).json({ message: 'Utilisateur introuvable.' });
    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Jeton invalide ou expiré.' });
  }
}
const autoriser = (...roles) => (req, res, next) => {
  if (!req.utilisateur || !roles.includes(req.utilisateur.role.nom)) {
    return res.status(403).json({ message: 'Accès interdit.' });
  }
  next();
};
module.exports = { authentifier, autoriser };
