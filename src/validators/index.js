const { body, param, validationResult } = require('express-validator');
const verifier = (req, res, next) => {
  const erreurs = validationResult(req);
  if (!erreurs.isEmpty()) return res.status(422).json({ message: 'Validation échouée.', erreurs: erreurs.array() });
  next();
};
const id = [param('id').isInt({ min: 1 }).withMessage('ID invalide.')];
const authRegister = [
  body('nom').trim().notEmpty().withMessage('Nom obligatoire.'),
  body('prenom').trim().notEmpty().withMessage('Prénom obligatoire.'),
  body('email').isEmail().withMessage('Adresse courriel invalide.'),
  body('motDePasse').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('roleId').isInt({ min: 1 }).withMessage('roleId doit être un entier positif.')
];
const authLogin = [body('email').isEmail(), body('motDePasse').notEmpty()];
module.exports = { verifier, id, authRegister, authLogin };
