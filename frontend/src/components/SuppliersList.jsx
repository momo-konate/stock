import React from 'react';
import { Truck, Phone, Mail, MapPin, Edit2, Trash2, Plus, Tag } from 'lucide-react';

const SuppliersList = ({ suppliers, onEdit, onDelete, onCreateSupplier, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-48"></div>
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Aucun fournisseur</h3>
        <p className="text-slate-500 mt-2">Enregistrez vos fournisseurs pour suivre vos sources d'approvisionnement.</p>
        <button 
          onClick={onCreateSupplier}
          className="mt-6 btn btn-primary"
        >
          <Plus size={18} />
          Ajouter un fournisseur
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <div key={supplier.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Truck size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 truncate">{supplier.name}</h3>
              {supplier.category && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Tag size={10} />
                  {supplier.category}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {supplier.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                {supplier.phone}
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                {supplier.email}
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate">{supplier.address}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(supplier)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-sm font-bold transition-all"
            >
              <Edit2 size={16} />
              Modifier
            </button>
            <button 
              onClick={() => onDelete(supplier.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuppliersList;
