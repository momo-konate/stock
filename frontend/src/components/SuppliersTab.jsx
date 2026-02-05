import React from 'react';
import { Plus } from 'lucide-react';
import SuppliersList from './SuppliersList';

const SuppliersTab = ({ 
  suppliers, 
  handleCreateSupplier, 
  handleEditSupplier, 
  handleDeleteSupplier, 
  isLoading 
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Fournisseurs</h1>
          <p className="text-slate-500 mt-1">Gérez vos sources d'approvisionnement et contacts.</p>
        </div>
        <button 
          onClick={handleCreateSupplier}
          className="btn bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
        >
          <Plus size={20} />
          Ajouter un fournisseur
        </button>
      </div>
      <SuppliersList 
        suppliers={suppliers}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        onCreateSupplier={handleCreateSupplier}
        isLoading={isLoading}
      />
    </>
  );
};

export default SuppliersTab;
