import express from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expense.controller.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', isAdmin, deleteExpense);

export default router;
