import { useState, useCallback } from 'react';
import { categoryService } from '../services/api';

export const useCategories = (showToast) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      showToast('Erreur lors de la récupération des catégories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleCategorySubmit = useCallback(async (formData, id = null) => {
    setIsSubmitLoading(true);
    try {
      if (id) {
        const { data } = await categoryService.update(id, formData);
        setCategories(prev => prev.map(c => c.id === id ? data : c));
        showToast('Catégorie mise à jour');
      } else {
        const { data } = await categoryService.create(formData);
        setCategories(prev => [...prev, data]);
        showToast('Catégorie créée');
      }
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  const handleDeleteCategory = useCallback(async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      setIsSubmitLoading(true);
      try {
        await categoryService.delete(id);
        setCategories(prev => prev.filter(c => c.id !== id));
        showToast('Catégorie supprimée');
        return true;
      } catch (error) {
        showToast(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
        return false;
      } finally {
        setIsSubmitLoading(false);
      }
    }
    return false;
  }, [showToast]);

  return {
    categories,
    isLoading,
    isSubmitLoading,
    fetchCategories,
    handleCategorySubmit,
    handleDeleteCategory
  };
};
