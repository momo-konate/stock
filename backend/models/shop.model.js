import { DataTypes } from 'sequelize';
import { sequelize } from '../models/product.model.js';

export const Shop = sequelize.define('Shop', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ma Boutique'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logo: {
    type: DataTypes.TEXT, // Base64 for simplicity in this small app
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One shop per admin
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});
