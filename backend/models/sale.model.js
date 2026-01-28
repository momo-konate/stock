import { DataTypes } from 'sequelize';
import { sequelize } from './product.model.js';

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
  }
});

// Synchronisation automatique
Sale.sync();

export { Sale };
