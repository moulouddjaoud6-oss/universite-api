# API de gestion universitaire

API REST réalisée avec Node.js, Express, Sequelize et MySQL. Elle gère les rôles, utilisateurs, étudiants, professeurs, départements, cours, inscriptions et notes.

## Prérequis
- Node.js 18 ou plus récent
- MySQL 8 (ou compatible)
- npm

## Installation
1. Créer une base MySQL vide nommée `universite_db` :
   ```sql
   CREATE DATABASE universite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Copier `.env.example` vers `.env`, puis renseigner les paramètres MySQL et une longue valeur `JWT_SECRET`.
3. Installer les dépendances et initialiser la base :
   ```bash
   npm install
   npm run db:sync
   npm run db:seed
   npm run dev
   ```
4. L'API démarre sur `http://localhost:3000`.

Compte administrateur de démonstration :
- Courriel : `admin@universite.local`
- Mot de passe : `Admin12345!`

**À faire avant toute mise en production :** changer ce mot de passe, remplacer `JWT_SECRET`, utiliser HTTPS, restreindre CORS et mettre en place une stratégie de sauvegarde.

## Authentification
1. `POST /api/auth/connexion` avec `{ "email": "...", "motDePasse": "..." }`.
2. Copier le champ `token` retourné.
3. Envoyer `Authorization: Bearer <token>` sur les routes protégées.

Création de compte : `POST /api/auth/inscription` avec `nom`, `prenom`, `email` et `motDePasse` (8 caractères minimum). Le serveur attribue automatiquement le rôle Etudiant; un visiteur ne peut pas choisir un rôle privilégié.

## Routes
Toutes les routes métier demandent un JWT. Les créations, modifications et suppressions sont réservées au rôle `Administrateur`.

| Ressource | Routes |
|---|---|
| Rôles | `GET /api/roles` |
| Utilisateurs | `/api/utilisateurs` |
| Étudiants | `/api/etudiants` |
| Professeurs | `/api/professeurs` |
| Départements | `/api/departements` |
| Cours | `/api/cours` |
| Inscriptions | `/api/inscriptions` |
| Notes | `/api/notes` |

Pour chaque ressource ci-dessus : `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`. Les listes acceptent `?page=1&limit=10` (maximum 100). Les uploads d'image utilisent `multipart/form-data`, champ `photo`, formats JPEG/PNG/WebP/GIF, 5 Mo maximum.

## Exemple de connexion
```http
POST /api/auth/connexion
Content-Type: application/json

{"email":"admin@universite.local","motDePasse":"Admin12345!"}
```

## Exemple de création d'un département
```http
POST /api/departements
Authorization: Bearer VOTRE_JETON
Content-Type: application/json

{"nom":"Informatique","description":"Département des sciences informatiques"}
```

## Tests Postman
Importer `postman/Universite-API.postman_collection.json`. Exécuter d'abord « Connexion admin »; le script de la collection stocke automatiquement le jeton dans la variable `token`. Puis tester les routes.

## Structure
- `src/config` : connexion Sequelize/MySQL
- `src/models` : modèles et associations
- `src/controllers` : logique des contrôleurs
- `src/routes` : routes API
- `src/middlewares` : JWT, rôles, upload et erreurs
- `src/validators` : validations
- `scripts` : synchronisation et données de démonstration

## Limites et améliorations recommandées
Ce dépôt est une base pédagogique complète à exécuter et à vérifier avec votre équipe. Les règles métier détaillées (ex. notes multiples par cours, droits d'accès par propriétaire, suppression en cascade) doivent être validées avec le professeur. Il faut aussi ajouter des tests automatisés, une migration Sequelize versionnée et une politique de confidentialité avant un usage réel.


Documents complémentaires : `docs/RAPPORT_PROJET.md`, `docs/MCD-MPD.md` et `docs/PLAN_TESTS_POSTMAN.md`.
