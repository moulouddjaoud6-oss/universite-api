# Rapport de projet — API de gestion universitaire

## 1. Contexte et objectif
Le projet consiste à concevoir le backend d'une application de gestion universitaire. L'API REST centralise les données et expose des routes permettant de gérer les utilisateurs, les rôles, les étudiants, les professeurs, les départements, les cours, les inscriptions et les notes.

## 2. Technologies
- Node.js : environnement d'exécution JavaScript.
- Express.js : serveur HTTP et routage REST.
- MySQL : système de gestion de base de données relationnelle.
- Sequelize : ORM et définition des modèles/associations.
- JWT : authentification par jeton.
- express-validator : validation des entrées.
- Multer : téléversement des images.
- Postman : tests manuels des routes.
- Git/GitHub : versionnement du code.

## 3. Modules fonctionnels
- Authentification : création d'un compte étudiant et connexion.
- Administration : gestion des rôles, utilisateurs et ressources.
- Gestion pédagogique : départements, professeurs et cours.
- Scolarité : inscriptions et notes.
- Médias : images de profils et de départements.
- Consultation : pagination des listes.

## 4. Sécurité
Les mots de passe sont hachés avec bcrypt. Le jeton JWT est transmis dans l'en-tête `Authorization: Bearer <token>`. Les routes métier sont protégées et les opérations d'écriture sont réservées au rôle Administrateur. L'inscription publique attribue uniquement le rôle Etudiant pour éviter l'auto-attribution d'un rôle privilégié.

## 5. Base de données
La base comporte huit tables reliées par des clés étrangères. Le détail des cardinalités et contraintes figure dans `MCD-MPD.md`.

## 6. Tests
La collection Postman fournie contient un contrôle de santé, la connexion administrateur et des exemples de consultation/création. Les autres routes suivent le même modèle REST. Il faut compléter les essais avec des données valides et conserver les captures/résultats de l'équipe.

## 7. Installation et exécution
Suivre les étapes de `README.md`. Le projet nécessite une instance MySQL locale et une configuration `.env`. Après installation, synchroniser les tables, créer les données initiales et lancer le serveur.

## 8. Limites et travaux futurs
Cette livraison couvre la première partie backend du sujet. Le frontend EJS/Vue.js est hors du périmètre du présent document, car le sujet fourni le prévoit dans une deuxième partie. Avant une utilisation réelle, il faut ajouter des tests automatisés, des migrations versionnées, une politique de sauvegarde, une journalisation adaptée et des contrôles d'accès plus fins.
