import { Product } from './product.model.js';
import { Sale } from './sale.model.js';
import { Client } from './client.model.js';
import { ClientTransaction } from './clientTransaction.model.js';
import { User } from './user.model.js';

export const setupAssociations = () => {
  // Sale associations
  Sale.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(Sale, { foreignKey: 'productId' });

  Sale.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
  Client.hasMany(Sale, { foreignKey: 'clientId' });

  Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Sale, { foreignKey: 'userId' });

  // ClientTransaction associations
  ClientTransaction.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
  Client.hasMany(ClientTransaction, { foreignKey: 'clientId' });

  ClientTransaction.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });
  Sale.hasMany(ClientTransaction, { foreignKey: 'saleId' });

  // Product associations
  Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Product, { foreignKey: 'userId' });

  // User hierarchy
  User.belongsTo(User, { as: 'parent', foreignKey: 'parentId' });
  User.hasMany(User, { as: 'members', foreignKey: 'parentId' });
};
