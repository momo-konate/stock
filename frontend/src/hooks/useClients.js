import { useState, useCallback } from 'react';
import { clientService } from '../services/api';

export const useClients = (showToast) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const { data } = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erreur fetch clients:', error);
    }
  }, []);

  const handleClientSubmit = async (formData, selectedClient) => {
    try {
      if (selectedClient) {
        const { data } = await clientService.update(selectedClient.id, formData);
        setClients(clients.map(c => c.id === data.id ? data : c));
        showToast('Client mis à jour');
      } else {
        const { data } = await clientService.create(formData);
        setClients([data, ...clients]);
        showToast('Client créé avec succès');
      }
      return true;
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement du client', 'error');
      return false;
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
        await clientService.delete(id);
        setClients(clients.filter(c => c.id !== id));
        showToast('Client supprimé');
        return true;
      } catch (error) {
        showToast(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
        return false;
      }
    }
    return false;
  };

  const handleRepayClient = async (id, amount) => {
    try {
      const { data } = await clientService.addRepayment(id, amount);
      setClients(clients.map(c => c.id === data.id ? data : c));
      fetchClients(); // Deep refresh for safety
      showToast('Remboursement effectué avec succès');
      return true;
    } catch (error) {
      showToast('Erreur lors du remboursement', 'error');
      return false;
    }
  };

  return {
    clients,
    setClients,
    isLoading,
    fetchClients,
    handleClientSubmit,
    handleDeleteClient,
    handleRepayClient
  };
};
