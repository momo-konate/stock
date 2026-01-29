import express from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplier.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.js';
import { supplierSchema } from '../schemas/supplier.schema.js';

const router = express.Router();

router.use(protect);

router.get('/', getSuppliers);
router.post('/', validate(supplierSchema), createSupplier);
router.put('/:id', validate(supplierSchema), updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;
