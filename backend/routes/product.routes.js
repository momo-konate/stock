import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { validate } from '../middleware/validation.js';
import { productSchema } from '../schemas/product.schema.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', validate(productSchema), createProduct);
router.put('/:id', validate(productSchema), updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

export default router;
