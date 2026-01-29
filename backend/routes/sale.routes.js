import express from 'express';
import { getSales, createSale, deleteAllSales, getDeletedSales, getSaleById, deleteSale } from '../controllers/sale.controller.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { validate } from '../middleware/validation.js';
import { saleSchema } from '../schemas/sale.schema.js';

const router = express.Router();

router.get('/', getSales);
router.get('/deleted', isAdmin, getDeletedSales);
router.get('/:id', getSaleById);
router.post('/', validate(saleSchema), createSale);
router.delete('/:id', isAdmin, deleteSale);
router.delete('/', isAdmin, deleteAllSales);

export default router;
