import React from 'react';
import { Plus, Trash2, Wallet } from 'lucide-react';

const ExpensesTab = ({ 
  expenses, 
  totalSalesValue, 
  totalExpensesValue, 
  netBalance, 
  setIsExpenseModalOpen, 
  handleDeleteExpense, 
  user,
  isSubmitLoading 
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Journal de Caisse</h1>
          <p className="text-slate-500 mt-1">Suivez les entrées et sorties d'argent.</p>
        </div>
        <button 
          onClick={() => setIsExpenseModalOpen(true)}
          className="btn bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20"
        >
          <Plus size={20} />
          Nouvelle Dépense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-white">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Ventes (Entrées)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            + {totalSalesValue.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
        <div className="card p-6 bg-white">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Dépenses (Sorties)</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            - {totalExpensesValue.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
        <div className={`card p-6 ${netBalance >= 0 ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Solde Net en Caisse</p>
          <p className="text-3xl font-bold mt-2">
            {netBalance.toLocaleString('fr-FR')} <span className="text-lg font-normal">FCFA</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                {user?.role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(expense.date).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">
                    - {expense.amount.toLocaleString('fr-FR')} FCFA
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <Wallet size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Aucune dépense enregistrée.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExpensesTab;
