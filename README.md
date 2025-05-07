# 📦 API de Gestion de Stock

> Création d'API pour la Gestion de Stock – Test de 2H

## 📝 Résumé du Projet

Dans le cadre d’un test technique de 2 heures, ce projet a été développé afin de créer une API RESTful de gestion de stock. Il permet de gérer des produits, leurs catégories et les mouvements de stock, avec une authentification pour sécuriser les routes sensibles. Le développement a été réalisé en **Node.js** avec **Express.js** et **Sequelize** pour l’interaction avec une base de données **MySQL**.

## 🛠️ Technologies et Outils Utilisés

### Backend
- **Node.js** + **Express.js** : Création des routes et logique métier.
- **Sequelize** : ORM pour MySQL.
- **MySQL** : Base de données relationnelle.
- **JWT** : Authentification sécurisée par token.
- **Nodemon** : Redémarrage automatique du serveur lors du développement.
- **Middlewares personnalisés** : Validation, sécurité, gestion des erreurs.

### Outils de Développement
- **XAMPP** : Serveur local pour MySQL.
- **Postman** : Tests API.
- **Swagger** : Documentation interactive de l’API.
- **VSCode** : IDE utilisé pour le développement.

## 🚀 Fonctionnalités Développées

### 1. 🔧 Gestion des Produits
- CRUD complet (Create, Read, Update, Delete)
- Attributs : `nom`, `description`, `prix`, `quantité`, etc.

### 2. 📦 Gestion des Stocks
- Ajout et retrait de quantité
- Contrôle des erreurs (quantité négative, null, etc.)

### 3. 🗂️ Gestion des Catégories
- Attribution de produits à des catégories
- CRUD complet des catégories

### 4. 🔐 Authentification Admin
- Connexion sécurisée via JWT
- Middleware pour restreindre l’accès aux routes protégées

## 🧪 Tests & Documentation

- **Swagger** : Documentation complète des routes [Swagger intégré dans le projet]
- **Postman** : Tests manuels de tous les endpoints
- **Gestion centralisée des erreurs** : Réponses claires et structurées

## 🗃️ Seeders

Des seeders sont inclus pour peupler automatiquement la base de données avec :
- Des produits de test
- Des catégories
- Des utilisateurs (admin)

👉 Pour exécuter les seeders :
```bash
npx sequelize db:seed:all
