import React from 'react';
import { Edit2, Trash2, Package, ShoppingBag, RotateCcw } from 'lucide-react';

const ProductList = ({ products, onEdit, onDelete, onSell, onResetStock, isLoading, userRole }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-48"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Aucun produit</h3>
        <p className="text-slate-500 mt-2">Commencez par ajouter votre premier article.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  {product.categorie || 'Général'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{product.nom}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description || 'Aucune description'}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              product.quantite > (product.alertThreshold || 10) 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700 animate-pulse'
            }`}>
              Stock: {product.quantite}
            </span>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prix Unitaire</p>
              <p className="text-2xl font-black text-slate-900">{product.prix.toLocaleString('fr-FR')} <span className="text-base font-normal text-slate-500">FCFA</span></p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
            <button 
              onClick={() => onSell(product)}
              className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn"
            >
              <ShoppingBag size={18} className="transition-transform group-hover/btn:scale-110" />
              Vendre
            </button>
            <button 
              onClick={() => onEdit(product)}
              className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              title="Modifier"
            >
              <Edit2 size={18} />
            </button>
            <>
              <button 
                onClick={() => onResetStock(product.id)}
                className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                title="Vider le stock (remettre à 0)"
              >
                <RotateCcw size={18} />
              </button>
              <button 
                onClick={() => onDelete(product.id)}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
