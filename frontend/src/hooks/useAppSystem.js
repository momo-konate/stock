import { useState, useCallback } from 'react';
import { expenseService, shopService } from '../services/api';

export const useAppSystem = (showToast) => {
  const [expenses, setExpenses] = useState([]);
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await expenseService.getAll();
      setExpenses(data);
    } catch (error) {}
  }, []);

  const fetchShopSettings = useCallback(async () => {
    try {
      const { data } = await shopService.get();
      setShop(data);
    } catch (error) {}
  }, []);

  const handleExpenseSubmit = async (formData) => {
    try {
      const { data } = await expenseService.create(formData);
      setExpenses([data, ...expenses]);
      showToast('Dépense enregistrée');
      return true;
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement de la dépense', 'error');
      return false;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      setExpenses(expenses.filter(e => e.id !== id));
      showToast('Dépense supprimée');
      return true;
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
      return false;
    }
  };

  const handleShopUpdate = async (formData) => {
    try {
      const { data } = await shopService.update(formData);
      setShop(data);
      showToast('Paramètres mis à jour');
      return true;
    } catch (error) {
      showToast('Erreur lors de la mise à jour des paramètres', 'error');
      return false;
    }
  };

  return {
    expenses,
    shop,
    isLoading,
    fetchExpenses,
    fetchShopSettings,
    handleExpenseSubmit,
    handleDeleteExpense,
    handleShopUpdate
  };
};
