# Plan de tests Postman

Base URL : `http://localhost:3000/api`

| N° | Méthode | Route | Résultat attendu |
|---|---|---|---|
| 1 | GET | `/health` | 200, status OK |
| 2 | POST | `/auth/connexion` | 200, jeton JWT |
| 3 | GET | `/roles` | 200, liste des rôles |
| 4 | GET | `/departements?page=1&limit=10` | 200, liste paginée |
| 5 | POST | `/departements` | 201, département créé (admin) |
| 6 | GET | `/departements/1` | 200 si présent, sinon 404 |
| 7 | PUT | `/departements/1` | 200 si présent (admin) |
| 8 | DELETE | `/departements/1` | 200 si présent (admin) |
| 9 | GET sans jeton | `/etudiants` | 401 |
| 10 | POST avec rôle étudiant | `/departements` | 403 |

Pour chaque ressource (`utilisateurs`, `etudiants`, `professeurs`, `departements`, `cours`, `inscriptions`, `notes`), répéter les tests CRUD. Ajouter des tests de validation (champs manquants, email incorrect, note hors limites, identifiant inexistant) et d'upload d'image avec `multipart/form-data`.
