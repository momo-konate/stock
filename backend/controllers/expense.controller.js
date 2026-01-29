import { Expense } from '../models/expense.model.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.ownerId },
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des dépenses', error: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;
    
    const expense = await Expense.create({
      description,
      amount,
      userId: req.ownerId
    });
    
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la dépense', error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id, userId: req.ownerId } });
    res.json({ message: 'Dépense supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
