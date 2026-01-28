# StockPro - Application de Gestion de Stock

StockPro est une application full-stack moderne pour la gestion d'inventaire, construite avec React, Node.js et SQLite.

## Fonctionnalités

- **CRUD complet** : Ajouter, lister, modifier et supprimer des produits.
- **Gestion des Ventes** : Enregistrer des ventes avec mise à jour automatique des quantités en stock.
- **Historique des Ventes** : Suivi du chiffre d'affaires et des transactions passées.
- **Interface Moderne** : Design propre avec navigation par onglets (Stock / Ventes).

## Installation

### 1. Cloner le projet

```bash
# Ouvrez un terminal dans le dossier du projet
```

### 2. Configurer le Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarrera sur [http://localhost:5000](http://localhost:5000).

### 3. Configurer le Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## 📁 Structure du Projet

- `/backend` : API Express, modèles Sequelize et base de données SQLite.
- `/frontend` : Application React (Vite), Tailwind CSS et appels Axios.

## 📝 Champs du Produit

- **Nom** : Identifiant du produit.
- **Description** : Informations détaillées.
- **Quantité** : Stock disponible (avec indicateur visuel de stock bas).
- **Prix** : Prix unitaire en FCFA.
- **Date de création** : Géré automatiquement par le backend.
# stock
