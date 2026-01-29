import { Sale } from '../models/sale.model.js';
import { Product } from '../models/product.model.js';
import { Client } from '../models/client.model.js';
import { ClientTransaction } from '../models/clientTransaction.model.js';
import { sequelize } from '../models/product.model.js';
import { Op } from 'sequelize';

// Récupérer toutes les ventes pour l'utilisateur
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { userId: req.ownerId },
      order: [['createdAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ventes', error: error.message });
  }
};

// Récupérer les ventes supprimées (Corbeille)
export const getDeletedSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { 
        userId: req.ownerId,
        deletedAt: { [Op.not]: null }
      },
      paranoid: false, // Inclure les éléments supprimés
      order: [['deletedAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la corbeille', error: error.message });
  }
};

// Créer une vente (avec mise à jour du stock et isolation par utilisateur)
export const createSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productId, quantite, clientId, paymentType, amountPaid } = req.body;
    
    // 1. Vérifier si le produit existe et appartient à l'utilisateur
    const product = await Product.findOne({ where: { id: productId, userId: req.ownerId } });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // 2. Vérifier le stock
    if (product.quantite < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // 3. Calculer le total
    const total = product.prix * quantite;
    const paid = amountPaid !== undefined ? amountPaid : (paymentType === 'credit' ? 0 : total);
    const debt = total - paid;

    // Déterminer le statut de paiement
    let paymentStatus = 'paid';
    if (paid === 0) paymentStatus = 'unpaid';
    else if (paid < total) paymentStatus = 'partial';

    // 4. Si c'est à crédit, vérifier le client
    if (debt > 0 && !clientId) {
      return res.status(400).json({ message: 'Un client est requis pour une vente à crédit' });
    }

    if (clientId && debt > 0) {
      const client = await Client.findOne({ where: { id: clientId, userId: req.ownerId } });
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      await client.update({ 
        totalDebt: client.totalDebt + debt 
      }, { transaction: t });
    }

    // 5. Créer l'enregistrement de vente
    const newSale = await Sale.create({
      productId,
      productName: product.nom,
      quantite,
      prixUnitaire: product.prix,
      total,
      userId: req.ownerId,
      clientId,
      paymentType: paymentType || (debt > 0 ? 'credit' : 'cash'),
      amountPaid: paid,
      paymentStatus
    }, { transaction: t });

    // Enregistrer la transaction client si il y a une dette
    if (clientId && debt > 0) {
      console.log(`Log de DETTE pour client ${clientId}: ${debt} FCFA`);
      await ClientTransaction.create({
        clientId: clientId,
        type: 'DEBT',
        amount: debt,
        description: `Dette issue de la vente du produit: ${product.nom}`,
        saleId: newSale.id,
        date: new Date()
      }, { transaction: t });
    }

    // 6. Mettre à jour le stock du produit
    await product.update({
      quantite: product.quantite - quantite
    }, { transaction: t });

    await t.commit();
    res.status(201).json(newSale);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: 'Erreur lors de la vente', error: error.message });
  }
};

// Vider l'historique des ventes de l'utilisateur
export const deleteAllSales = async (req, res) => {
  try {
    await Sale.destroy({ where: { userId: req.ownerId } });
    res.json({ message: 'Historique des ventes vidé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'historique', error: error.message });
  }
};
// Récupérer une vente par son ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: { id: req.params.id, userId: req.ownerId }
    });
    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la vente', error: error.message });
  }
};
// Supprimer une vente individuelle (et restaurer le stock)
export const deleteSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const sale = await Sale.findOne({ 
      where: { id: req.params.id, userId: req.ownerId } 
    });

    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    // Restaurer le stock
    const product = await Product.findOne({ where: { id: sale.productId, userId: req.ownerId } });
    if (product) {
      await product.update({
        quantite: product.quantite + sale.quantite
      }, { transaction: t });
    }

    // Supprimer la vente (Soft delete via paranoid: true)
    await sale.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Vente supprimée et stock restauré' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
