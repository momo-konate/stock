# Backend - StockPro

API REST pour la gestion de stock StockPro construite avec Node.js, Express et SQLite.

## Installation

```bash
cd backend
npm install
```

## Configuration

Créez un fichier `.env` à la racine du dossier backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

## Scripts disponibles

- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer avec nodemon (recharge automatique)
- `npm test` - Exécuter les tests
- `npm run test:coverage` - Générer un rapport de couverture

## Structure du projet

```
backend/
├── config/              # Configuration centralisée
├── controllers/         # Logique métier
├── middleware/          # Middlewares Express
├── models/              # Modèles Sequelize
├── routes/              # Routes API
├── schemas/             # Validation Joi
├── utils/               # Utilitaires (logger, etc.)
├── tests/               # Tests unitaires
├── .env.example         # Exemple de configuration
├── package.json         # Dépendances
└── server.js            # Point d'entrée
```

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe

### Protected Routes

- `GET/POST /api/products` - Gestion des produits
- `GET/POST /api/sales` - Gestion des ventes
- `GET/POST /api/expenses` - Gestion des dépenses
- `GET/POST /api/clients` - Gestion des clients
- `GET/POST /api/suppliers` - Gestion des fournisseurs
- `GET/POST /api/categories` - Gestion des catégories
- `GET/POST /api/shop` - Gestion de la boutique

## Sécurité

- ✅ Authentification JWT
- ✅ Rate limiting
- ✅ Helmet pour les headers de sécurité
- ✅ CORS configuré
- ✅ Validation des données avec Joi
- ✅ Hachage des mots de passe avec bcryptjs

## Développement

Le projet utilise:

- **Framework**: Express.js
- **Base de données**: SQLite avec Sequelize ORM
- **Validation**: Joi
- **Tests**: Vitest
- **Monitoring**: Nodemon (développement)
