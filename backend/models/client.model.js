// Modèle Client : client de la boutique. `totalDebt` = dette totale (crédit).
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalDebt: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  idCardPhoto: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
});

export { Client };
