import { DataTypes } from 'sequelize';
import { sequelize } from './product.model.js';

const ClientTransaction = sequelize.define('ClientTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('DEBT', 'PAYMENT'),
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  saleId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

export { ClientTransaction };
