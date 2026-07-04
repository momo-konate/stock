// Modèle Category : catégorie de produits, propre à chaque utilisateur (userId).
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: true
});

export { sequelize, Category };
