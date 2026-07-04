import { useState, useCallback } from 'react';
import { saleService } from '../services/api';

export const useSales = (showToast, fetchClients, setProducts) => {
  const [sales, setSales] = useState([]);
  const [deletedSales, setDeletedSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [viewingSale, setViewingSale] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchSales = useCallback(async (category = null) => {
    setIsLoading(true);
    try {
      const { data } = await saleService.getAll(category);
      setSales(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDeletedSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await saleService.getDeleted();
      setDeletedSales(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaleSubmit = useCallback(async (formData, products) => {
    setIsSubmitLoading(true);
    try {
      const { data } = await saleService.create(formData);
      setSales(prev => [data, ...prev]);
      
      if (setProducts) {
        setProducts(prev => prev.map(p => 
          p.id === formData.productId 
          ? { ...p, quantite: p.quantite - formData.quantite } 
          : p
        ));
      }
      
      setViewingSale({
        ...data,
        productName: products.find(p => p.id === formData.productId)?.nom || 'Produit'
      });
      setIsReceiptModalOpen(true);
      
      showToast('Vente enregistrée avec succès');
      if (fetchClients) fetchClients();
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de la vente', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [fetchClients, setProducts, showToast]);

  const handleQuickSale = useCallback(async (product) => {
    if (product.quantite <= 0) {
      showToast('Stock épuisé pour ce produit', 'error');
      return false;
    }
    
    setIsSubmitLoading(true);
    try {
      const formData = {
        productId: product.id,
        quantite: 1
      };
      const { data } = await saleService.create(formData);
      setSales(prev => [data, ...prev]);
      
      if (setProducts) {
        setProducts(prev => prev.map(p => 
          p.id === product.id 
          ? { ...p, quantite: p.quantite - 1 } 
          : p
        ));
      }
      
      setViewingSale({
        ...data,
        productName: product.nom
      });
      setIsReceiptModalOpen(true);
      showToast('Vente effectuée !');
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de la vente', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [setProducts, showToast]);

  const handleDeleteSale = useCallback(async (id, products) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette vente ? Le stock sera restauré.')) {
      try {
        await saleService.delete(id);
        const deletedSale = sales.find(s => s.id === id);
        if (deletedSale && setProducts) {
          setProducts(prev => prev.map(p => 
            p.id === deletedSale.productId 
            ? { ...p, quantite: p.quantite + deletedSale.quantite } 
            : p
          ));
        }
        setSales(prev => prev.filter(s => s.id !== id));
        showToast('Vente supprimée et stock restauré');
        if (fetchClients) fetchClients();
        return true;
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
        return false;
      }
    }
    return false;
  }, [sales, setProducts, showToast, fetchClients]);

  const handleDeleteAllSales = useCallback(async () => {
    if (window.confirm('Voulez-vous vraiment vider tout l\'historique des ventes ? Cette action est irréversible.')) {
      try {
        await saleService.deleteAll();
        setSales([]);
        showToast('Historique des ventes vidé');
        return true;
      } catch (error) {
        showToast('Erreur lors de la suppression de l\'historique', 'error');
        return false;
      }
    }
    return false;
  }, [showToast]);

  return {
    sales,
    deletedSales,
    isSubmitLoading,
    viewingSale,
    setViewingSale,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    fetchSales,
    fetchDeletedSales,
    handleSaleSubmit,
    handleQuickSale,
    handleDeleteSale,
    handleDeleteAllSales
  };
};
