import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

// Récupérer toutes les catégories du shop (utilisateur)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.ownerId },
      order: [["nom", "ASC"]],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catégories",
      error: error.message,
    });
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { nom } = req.body;

    // Vérifier si elle existe déjà
    const existing = await Category.findOne({
      where: { nom: nom, userId: req.ownerId },
    });

    if (existing) {
      return res.status(400).json({ message: "Cette catégorie existe déjà" });
    }

    const newCategory = await Category.create({
      nom,
      userId: req.ownerId,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création de la catégorie",
      error: error.message,
    });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    const category = await Category.findOne({
      where: { id, userId: req.ownerId },
    });
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Mettre à jour les produits qui utilisent cette catégorie (si on veut garder la cohérence)
    // Ici on suppose que Product stocke le NOM de la catégorie par simplicité
    await Product.update(
      { categorie: nom },
      { where: { categorie: category.nom, userId: req.ownerId } },
    );

    await category.update({ nom });
    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour de la catégorie",
      error: error.message,
    });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: { id, userId: req.ownerId },
    });

    if (!category) {
      console.log(`Catégorie non trouvée pour l'ID: ${id}`);
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    const productUsing = await Product.findOne({
      where: { categorie: category.nom, userId: req.ownerId },
    });

    if (productUsing) {
      console.log(
        `Impossible de supprimer la catégorie ${category.nom} car elle est utilisée par des produits.`,
      );
      return res.status(400).json({
        message:
          "Impossible de supprimer une catégorie utilisée par des produits",
      });
    }

    await category.destroy();
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression de la catégorie",
      error: error.message,
    });
  }
};
