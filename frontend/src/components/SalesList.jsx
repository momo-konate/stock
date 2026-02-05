import React from 'react';
import { History, TrendingUp, Printer, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SalesList = ({ sales, isLoading, onViewTicket, onDeleteSale, userRole }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <TrendingUp className="mx-auto text-slate-300 mb-3" size={48} />
        <p className="text-slate-500 font-medium">Aucune vente enregistrée.</p>
      </div>
    );
  }

  return (
    <div className="card border-emerald-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-emerald-50 border-b border-emerald-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-800">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-800">Produit</th>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-800 text-center">Quantité</th>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-800 text-right">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(sale.dateVente).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{sale.productName}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                    x {sale.quantite}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-emerald-700">{sale.total.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onViewTicket ? onViewTicket(sale) : navigate(`/ticket/${sale.id}`)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Voir / Imprimer le ticket"
                    >
                      <Printer size={18} />
                    </button>
                    {onDeleteSale && (
                      <button 
                        onClick={() => onDeleteSale(sale.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer la vente"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;
