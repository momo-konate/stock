import express from 'express';
import { getShopSettings, updateShopSettings } from '../controllers/shop.controller.js';

const router = express.Router();

// Protection gérée au niveau du serveur (server.js)
router.get('/', getShopSettings);
router.put('/', updateShopSettings);

export default router;
