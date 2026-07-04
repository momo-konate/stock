/**
 * Modèle Product (Produit)
 * -------------------------
 * Un article du stock. Appartient à un utilisateur via `userId`.
 * `paranoid: true` active le "soft delete" : supprimer un produit
 * ajoute une date `deletedAt` au lieu de l'effacer réellement.
 *
 * NB : on ré-exporte `sequelize` pour compatibilité avec les fichiers
 * qui l'importaient historiquement depuis ce modèle.
 */
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  alertThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Général'
  }
}, {
  paranoid: true // Active le "Soft Delete" (ajoute deletedAt)
});


export { sequelize, Product };
