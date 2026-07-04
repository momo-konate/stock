import { useState, useCallback } from 'react';
import { clientService } from '../services/api';

export const useClients = (showToast) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erreur fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClientSubmit = useCallback(async (formData, selectedClient) => {
    setIsSubmitLoading(true);
    try {
      if (selectedClient) {
        const { data } = await clientService.update(selectedClient.id, formData);
        setClients(prev => prev.map(c => c.id === data.id ? data : c));
        showToast('Client mis à jour');
      } else {
        const { data } = await clientService.create(formData);
        setClients(prev => [data, ...prev]);
        showToast('Client créé avec succès');
      }
      return true;
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement du client', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [showToast]);

  const handleDeleteClient = useCallback(async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      setIsSubmitLoading(true);
      try {
        await clientService.delete(id);
        setClients(prev => prev.filter(c => c.id !== id));
        showToast('Client supprimé');
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

  const handleRepayClient = useCallback(async (id, amount) => {
    setIsSubmitLoading(true);
    try {
      const { data } = await clientService.addRepayment(id, amount);
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
      fetchClients(); // Deep refresh for safety
      showToast('Remboursement effectué avec succès');
      return true;
    } catch (error) {
      showToast('Erreur lors du remboursement', 'error');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  }, [fetchClients, showToast]);

  return {
    clients,
    setClients,
    isLoading,
    isSubmitLoading,
    fetchClients,
    handleClientSubmit,
    handleDeleteClient,
    handleRepayClient
  };
};
