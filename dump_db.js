import { User } from './backend/models/user.model.js';
import { Product, sequelize } from './backend/models/product.model.js';
import { Sale } from './backend/models/sale.model.js';
import { Expense } from './backend/models/expense.model.js';
import { Shop } from './backend/models/shop.model.js';

async function dumpDatabase() {
  try {
    await sequelize.authenticate();
    console.log('--- CONNEXION RÉUSSIE ---\n');

    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
    console.log('=== UTILISATEURS ===');
    console.table(users.map(u => u.toJSON()));

    const products = await Product.findAll({ attributes: ['id', 'nom', 'prix', 'quantite'] });
    console.log('\n=== PRODUITS ===');
    console.table(products.map(p => p.toJSON()));

    const sales = await Sale.findAll({ attributes: ['id', 'productName', 'quantite', 'total', 'createdAt'] });
    console.log('\n=== VENTES ===');
    console.table(sales.map(s => ({
      id: s.id,
      produit: s.productName,
      qte: s.quantite,
      total: s.total,
      date: s.createdAt
    })));

    const expenses = await Expense.findAll();
    console.log('\n=== DÉPENSES ===');
    console.table(expenses.map(e => e.toJSON()));

    const shops = await Shop.findAll();
    console.log('\n=== BOUTIQUES ===');
    console.table(shops.map(s => ({
      id: s.id,
      name: s.name,
      userId: s.userId
    })));

  } catch (error) {
    console.error('Erreur dump:', error);
  } finally {
    process.exit();
  }
}

dumpDatabase();
