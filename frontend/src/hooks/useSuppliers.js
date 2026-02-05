import { useState, useCallback } from 'react';
import { supplierService } from '../services/api';

export const useSuppliers = (showToast) => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Erreur fetch suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSupplierSubmit = useCallback(async (formData, selectedSupplier) => {
    setIsSubmitLoading(true);
    try {
      if (selectedSupplier) {
        const { data } = await supplierService.update(selectedSupplier.id, formData);
        setSuppliers(prev => prev.map(s => s.id === data.id ? data : s));
        showToast('Fournisseur mis à jour');
      } else {
        const { data } = await supplierService.create(formData);
        setSuppliers(prev => [data, ...prev]);
        showToast('Fournisseur créé avec succès');
      }
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  const handleDeleteSupplier = useCallback(async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      try {
        await supplierService.delete(id);
        setSuppliers(prev => prev.filter(s => s.id !== id));
        showToast('Fournisseur supprimé');
        return true;
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
        return false;
      }
    }
    return false;
  }, [showToast]);

  return {
    suppliers,
    isLoading,
    isSubmitLoading,
    fetchSuppliers,
    handleSupplierSubmit,
    handleDeleteSupplier
  };
};
