import { useState, useCallback } from 'react';
import { authService } from '../services/api';

export const useUsers = (showToast) => {
  const [users, setUsers] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await authService.getUsers();
      setUsers(data);
    } catch (error) {}
  }, []);

  const handleUserSubmit = async (formData) => {
    try {
      const { data } = await authService.createSeller(formData);
      setUsers([data, ...users]);
      showToast('Vendeur créé avec succès');
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
      return false;
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await authService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        showToast('Utilisateur supprimé');
        return true;
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
        return false;
      }
    }
    return false;
  };

  return {
    users,
    fetchUsers,
    handleUserSubmit,
    handleDeleteUser
  };
};
