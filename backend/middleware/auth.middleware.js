/**
 * Middlewares d'authentification
 * ------------------------------
 * protect : vérifie le token JWT, charge l'utilisateur et définit `req.ownerId`
 *           (l'admin propriétaire des données, qu'on soit admin ou vendeur).
 * admin   : autorise uniquement les utilisateurs de rôle "admin".
 */
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findByPk(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé' });
      }
      
      // Définir l'ID du propriétaire (pour lier les données admin/vendeur)
      req.ownerId = req.user.parentId || req.user.id;
      
      return next();
    } catch (error) {
      logger.error('Échec de vérification du token', error);
      return res.status(401).json({ message: 'Non autorisé, échec du token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Non autorisé en tant qu\'administrateur' });
  }
};
