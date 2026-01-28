import express from 'express';
import { getSales, createSale, deleteAllSales } from '../controllers/sale.controller.js';

const router = express.Router();

router.get('/', getSales);
router.post('/', createSale);
router.delete('/', deleteAllSales);

export default router;
