import React from 'react';
import { FileSpreadsheet, ShoppingCart, TrendingUp } from 'lucide-react';
import SalesChart from './SalesChart';
import SalesList from './SalesList';

const SalesTab = ({ 
  sales, 
  handleExportExcel, 
  handleDeleteAllSales, 
  setIsSaleModalOpen, 
  onDeleteSale, 
  isLoading,
  user,
  setViewingSale,
  setIsReceiptModalOpen
}) => {
  const totalSalesValue = sales.reduce((acc, s) => acc + s.total, 0);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Historique des Ventes</h1>
          <p className="text-slate-500 mt-1">Suivez vos transactions et votre chiffre d'affaires.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="btn bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 shadow-sm"
          >
            <FileSpreadsheet size={20} className="text-emerald-600" />
            Excel
          </button>
          {sales.length > 0 && (
            <button 
              onClick={handleDeleteAllSales}
              className="btn btn-secondary border-red-200 text-red-600 hover:bg-red-50"
            >
              Vider l'historique
            </button>
          )}
          <button 
            onClick={() => setIsSaleModalOpen(true)}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
          >
            <ShoppingCart size={20} />
            Nouvelle Vente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 bg-emerald-600 text-white">
            <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider">Chiffre d'Affaires Total</p>
            <p className="text-3xl font-bold mt-2">
              {totalSalesValue.toLocaleString('fr-FR')} <span className="text-lg font-normal">FCFA</span>
            </p>
          </div>
          <div className="card p-6 bg-white flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Nombre de Ventes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{sales.length}</p>
            </div>
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <TrendingUp size={32} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <SalesChart sales={sales} />
        </div>
      </div>

      <SalesList 
        sales={sales} 
        onDeleteSale={onDeleteSale} 
        isLoading={isLoading} 
        onViewTicket={(sale) => {
          setViewingSale(sale);
          setIsReceiptModalOpen(true);
        }}
        userRole={user?.role}
      />
    </>
  );
};

export default SalesTab;
