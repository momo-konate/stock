import { Sale } from './models/sale.model.js';
import { Client } from './models/client.model.js';
import { Product } from './models/product.model.js';
import { ClientTransaction } from './models/clientTransaction.model.js';
import { sequelize } from './models/product.model.js';

async function simulateCreditSale() {
  const t = await sequelize.transaction();
  try {
    // 1. Trouver un produit et un client
    const product = await Product.findOne();
    const client = await Client.findOne();

    if (!product || !client) {
      console.log('Produit ou client manquant pour le test');
      process.exit(1);
    }

    console.log(`Test avec Produit: ${product.nom}, Client: ${client.name}`);

    const quantite = 1;
    const total = product.prix * quantite;
    const debt = total; // Vente à crédit totale

    // 2. Mettre à jour la dette du client
    await client.update({ totalDebt: client.totalDebt + debt }, { transaction: t });

    // 3. Créer la vente
    const newSale = await Sale.create({
      productId: product.id,
      productName: product.nom,
      quantite,
      prixUnitaire: product.prix,
      total,
      userId: client.userId,
      clientId: client.id,
      paymentType: 'credit',
      amountPaid: 0,
      paymentStatus: 'unpaid'
    }, { transaction: t });

    // 4. Créer la transaction (le point qu'on teste)
    const trans = await ClientTransaction.create({
      clientId: client.id,
      type: 'DEBT',
      amount: debt,
      description: `TEST: Dette issue de la vente: ${product.nom}`,
      saleId: newSale.id,
      date: new Date()
    }, { transaction: t });

    await t.commit();
    console.log('Vente et transaction créées avec succès !');
    console.log('ID Transaction:', trans.id);
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('Erreur simulation:', error);
    process.exit(1);
  }
}

simulateCreditSale();
