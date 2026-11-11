const router = require('express').Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { authentifier, autoriser } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { verifier, id, authRegister, authLogin } = require('../validators');
const auth = require('../controllers/authController');
const crud = require('../controllers/crudController');
const models = require('../models');

router.get('/health', (_req, res) => res.json({ status: 'OK', service: 'universite-api' }));
router.get('/roles', asyncHandler(crud.list(models.Role)));
router.post('/auth/inscription', authRegister, verifier, asyncHandler(auth.inscription));
router.post('/auth/connexion', authLogin, verifier, asyncHandler(auth.connexion));

const resources = [
  ['utilisateurs', models.Utilisateur, [], true],
  ['etudiants', models.Etudiant, [{ model: models.Utilisateur, as: 'utilisateur' }], true],
  ['professeurs', models.Professeur, [{ model: models.Utilisateur, as: 'utilisateur' }, { model: models.Departement, as: 'departement' }], true],
  ['departements', models.Departement, [], true],
  ['cours', models.Cours, [{ model: models.Professeur, as: 'professeur' }, { model: models.Departement, as: 'departement' }], true],
  ['inscriptions', models.Inscription, [{ model: models.Etudiant, as: 'etudiant' }, { model: models.Cours, as: 'cours' }], true],
  ['notes', models.Note, [
  {
    model: models.Inscription,
    as: 'inscription',
    include: [
      {
        model: models.Etudiant,
        as: 'etudiant',
        include: [
          {
            model: models.Utilisateur,
            as: 'utilisateur'
          }
        ]
      },
      {
        model: models.Cours,
        as: 'cours'
      }
    ]
  }
], true]
];

for (const [name, Model, includes, image] of resources) {
  const base = `/${name}`;
  router.get(base, authentifier, asyncHandler(crud.list(Model, includes)));
  router.get(`${base}/:id`, authentifier, id, verifier, asyncHandler(crud.get(Model, includes)));
  router.post(base, authentifier, autoriser('Administrateur'), image ? upload.single('photo') : (_req,_res,next)=>next(), asyncHandler(crud.create(Model)));
  router.put(`${base}/:id`, authentifier, autoriser('Administrateur'), id, verifier, image ? upload.single('photo') : (_req,_res,next)=>next(), asyncHandler(crud.update(Model)));
  router.delete(`${base}/:id`, authentifier, autoriser('Administrateur'), id, verifier, asyncHandler(crud.remove(Model)));
}
module.exports = router;
