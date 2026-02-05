import { Product } from '../models/product.model.js';
import { CATEGORIES } from '../constants/categories.js';

// Récupérer tous les produits
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = { userId: req.ownerId };

    if (category && category !== 'Toutes') {
      whereClause.categorie = category;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

// Récupérer les catégories
export const getCategories = async (req, res) => {
  try {
    // On retourne les constantes définies
    res.json({
      all: CATEGORIES
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error: error.message });
  }
};

// Créer un nouveau produit
export const createProduct = async (req, res) => {
  try {
    const { nom, description, quantite, prix, alertThreshold, categorie } = req.body;
    const newProduct = await Product.create({ 
      nom, 
      description, 
      quantite, 
      prix, 
      alertThreshold: alertThreshold || 10,
      categorie: categorie || 'Autre',
      userId: req.ownerId 
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, quantite, prix, alertThreshold, categorie } = req.body;
    
    const product = await Product.findOne({ where: { id, userId: req.ownerId } });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await product.update({ nom, description, quantite, prix, alertThreshold, categorie });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
  }
};

// Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id, userId: req.ownerId } });
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await product.destroy();
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
};
