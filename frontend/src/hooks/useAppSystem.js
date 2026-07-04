import { useState, useCallback } from 'react';
import { expenseService, shopService } from '../services/api';

export const useAppSystem = (showToast) => {
  const [expenses, setExpenses] = useState([]);
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await expenseService.getAll();
      setExpenses(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchShopSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await shopService.get();
      setShop(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExpenseSubmit = useCallback(async (formData) => {
    setIsSubmitLoading(true);
    try {
      const { data } = await expenseService.create(formData);
      setExpenses(prev => [data, ...prev]);
      showToast('Dépense enregistrée');
      return true;
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement de la dépense', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  const handleDeleteExpense = useCallback(async (id) => {
    setIsSubmitLoading(true);
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast('Dépense supprimée');
      return true;
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  const handleShopUpdate = useCallback(async (formData) => {
    setIsSubmitLoading(true);
    try {
      const { data } = await shopService.update(formData);
      setShop(data);
      showToast('Paramètres mis à jour');
      return true;
    } catch (error) {
      showToast('Erreur lors de la mise à jour des paramètres', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  return {
    expenses,
    shop,
    isLoading,
    isSubmitLoading,
    fetchExpenses,
    fetchShopSettings,
    handleExpenseSubmit,
    handleDeleteExpense,
    handleShopUpdate
  };
};
