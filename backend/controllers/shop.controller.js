// Controller Boutique : lit/écrit les paramètres du magasin (crée un profil si absent).
import { Shop } from '../models/shop.model.js';

export const getShopSettings = async (req, res) => {
  try {
    // On cherche les réglages de l'admin (ownerId)
    let shop = await Shop.findOne({ where: { userId: req.ownerId } });
    
    // Si aucun réglage n'existe encore, on crée un profil par défaut
    if (!shop) {
      shop = await Shop.create({
        name: 'Mon Business Pro',
        userId: req.ownerId
      });
    }
    
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paramètres', error: error.message });
  }
};

export const updateShopSettings = async (req, res) => {
  try {
    const { name, address, phone, logo } = req.body;

    let shop = await Shop.findOne({ where: { userId: req.ownerId } });

    if (shop) {
      await shop.update({ name, address, phone, logo });
    } else {
      shop = await Shop.create({ name, address, phone, logo, userId: req.ownerId });
    }

    res.json(shop);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour des paramètres', error: error.message });
  }
};
