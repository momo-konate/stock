import React from 'react';
import { Edit2, Trash2, Package, AlertCircle } from 'lucide-react';

const ProductList = ({ products, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <Package className="mx-auto text-slate-300 mb-3" size={48} />
        <p className="text-slate-500 font-medium">Aucun produit dans le stock.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nom</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Quantité</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Prix</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const isLowStock = product.quantite < 10 && product.quantite > 0;
              const isOutOfStock = product.quantite === 0;
              
              return (
                <tr 
                  key={product.id} 
                  className={`transition-colors border-l-4 ${
                    isOutOfStock ? 'bg-red-100/30 border-red-600' : 
                    isLowStock ? 'bg-red-50 border-red-500/50' : 
                    'hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      {product.nom}
                      {isLowStock && <AlertCircle size={16} className="text-red-600 animate-ping-short" />}
                      {isOutOfStock && <AlertCircle size={18} className="text-red-700" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-[200px] font-medium">{product.description || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ring-2 ${
                      product.quantite >= 10 ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' : 
                      product.quantite > 0 ? 'bg-red-600 text-white ring-red-300 animate-pulse' : 
                      'bg-slate-900 text-white ring-slate-400'
                    }`}>
                      {product.quantite === 0 ? 'RUPTURE' : `${product.quantite} UNITÉS`}
                      {isLowStock && <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${isLowStock || isOutOfStock ? 'text-red-700' : 'text-slate-700'}`}>
                    {product.prix.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
