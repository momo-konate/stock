import express from 'express';
import { getShopSettings, updateShopSettings } from '../controllers/shop.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getShopSettings);
router.put('/', protect, updateShopSettings);

export default router;
