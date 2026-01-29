import { sequelize } from './models/product.model.js';
import { User } from './models/user.model.js';
import { Sale } from './models/sale.model.js';
import Supplier from './models/supplier.model.js';

const syncDatabase = async () => {
  try {
    console.log('Synchronisation de la base de données...');
    // alter: true permet d'ajouter les colonnes manquantes sans supprimer les données
    await sequelize.sync({ alter: true });
    console.log('Base de données synchronisée avec succès (Schema mis à jour) !');
  } catch (error) {
    console.error('Erreur lors de la synchronisation :', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
