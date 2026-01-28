import { Sale } from '../models/sale.model.js';
import { Product } from '../models/product.model.js';
import { sequelize } from '../models/product.model.js';

// Récupérer toutes les ventes
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ventes', error: error.message });
  }
};

// Créer une vente (avec mise à jour du stock)
export const createSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productId, quantite } = req.body;
    
    // 1. Vérifier si le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // 2. Vérifier le stock
    if (product.quantite < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // 3. Calculer le total
    const total = product.prix * quantite;

    // 4. Créer l'enregistrement de vente
    const newSale = await Sale.create({
      productId,
      productName: product.nom,
      quantite,
      prixUnitaire: product.prix,
      total
    }, { transaction: t });

    // 5. Mettre à jour le stock du produit
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

// Vider l'historique des ventes
export const deleteAllSales = async (req, res) => {
  try {
    await Sale.destroy({ where: {}, truncate: true });
    res.json({ message: 'Historique des ventes vidé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'historique', error: error.message });
  }
};
