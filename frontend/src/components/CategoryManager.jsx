import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check, FolderPlus } from 'lucide-react';

const CategoryManager = ({ categories, onAdd, onUpdate, onDelete, isLoading }) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    onAdd({ nom: newCategory.trim() });
    setNewCategory('');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.nom);
  };

  const handleUpdate = () => {
    if (!editName.trim()) return;
    onUpdate(editingId, { nom: editName.trim() });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie (ex: Divers...)"
          className="input flex-1"
          required
        />
        <button 
          type="submit" 
          disabled={isLoading || !newCategory.trim()}
          className="btn btn-primary px-4"
        >
          <FolderPlus size={20} />
          Ajouter
        </button>
      </form>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Nom de la catégorie</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white transition-colors">
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input py-1 text-sm w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-700">{cat.nom}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button 
                            onClick={handleUpdate}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Valider"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(cat)}
                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => onDelete(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-slate-400 text-sm">
                    Aucune catégorie personnalisée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
        <p className="text-xs text-primary-800 flex items-start gap-2">
          <Check size={14} className="mt-0.5 shrink-0" />
          <span>Note: La modification d'une catégorie mettra à jour tous les produits qui l'utilisent. La suppression est impossible si des produits y sont encore rattachés.</span>
        </p>
      </div>
    </div>
  );
};

export default CategoryManager;
