// Modèle Sale : une vente. Soft delete (paranoid) pour la corbeille.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  prixUnitaire: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dateVente: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  paymentType: {
    type: DataTypes.ENUM('cash', 'credit', 'mixte'),
    defaultValue: 'cash'
  },
  amountPaid: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  paymentStatus: {
    type: DataTypes.ENUM('paid', 'partial', 'unpaid'),
    defaultValue: 'paid'
  }
}, {
  paranoid: true // Active le "Soft Delete"
});


export { Sale };
