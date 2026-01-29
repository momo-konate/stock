import { useState, useCallback } from 'react';
import { productService } from '../services/api';

export const useProducts = (showToast) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await productService.getAll();
      setProducts(data);
    } catch (error) {
      showToast('Erreur lors de la récupération des produits', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleProductSubmit = async (formData, selectedProduct) => {
    setIsSubmitLoading(true);
    try {
      if (selectedProduct) {
        const { data } = await productService.update(selectedProduct.id, formData);
        setProducts(products.map(p => p.id === data.id ? data : p));
        showToast('Produit mis à jour');
      } else {
        const { data } = await productService.create(formData);
        setProducts([data, ...products]);
        showToast('Produit ajouté avec succès');
      }
      return true;
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p.id !== id));
        showToast('Produit supprimé');
        return true;
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
        return false;
      }
    }
    return false;
  };

  return {
    products,
    setProducts,
    isLoading,
    isSubmitLoading,
    fetchProducts,
    handleProductSubmit,
    handleDeleteProduct
  };
};
