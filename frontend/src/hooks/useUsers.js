import { useState, useCallback } from "react";
import { authService } from "../services/api";

export const useUsers = (showToast) => {
  const [users, setUsers] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await authService.getUsers();
      setUsers(data);
    } catch (error) {}
  }, []);

  const handleUserSubmit = useCallback(
    async (formData, existingUser = null) => {
      setIsSubmitLoading(true);
      try {
        if (existingUser) {
          if (!existingUser.id) {
            console.error("ERROR: existingUser has no ID!", existingUser);
            showToast("Erreur: ID utilisateur manquant", "error");
            return false;
          }
          console.log("Updating user with ID:", existingUser.id);
          const { data } = await authService.updateUser(
            existingUser.id,
            formData,
          );
          setUsers((prev) =>
            prev.map((u) => (u.id === existingUser.id ? data : u)),
          );
          showToast("Utilisateur mis à jour");
        } else {
          const { data } = await authService.createSeller(formData);
          setUsers((prev) => [data, ...prev]);
          showToast("Vendeur créé avec succès");
        }
        return true;
      } catch (error) {
        console.error("Error submitting user:", error);
        console.error("Full error details:", error.response?.data);
        showToast(
          error.response?.data?.message || "Erreur lors de l'enregistrement",
          "error",
        );
        return false;
      } finally {
        setIsSubmitLoading(false);
      }
    },
    [showToast],
  );

  const handleDeleteUser = useCallback(
    async (id) => {
      console.log("Attempting to delete user with ID:", id);
      if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        try {
          console.log("Deleting user ID:", id);
          await authService.deleteUser(id);
          setUsers((prev) => prev.filter((u) => u.id !== id));
          showToast("Utilisateur supprimé");
          return true;
        } catch (error) {
          console.error("Error deleting user:", error);
          showToast("Erreur lors de la suppression", "error");
          return false;
        }
      }
      return false;
    },
    [showToast],
  );

  return {
    users,
    fetchUsers,
    handleUserSubmit,
    handleDeleteUser,
  };
};
