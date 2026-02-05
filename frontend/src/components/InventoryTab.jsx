import React from 'react';
import { Plus, ShoppingCart, HelpCircle, AlertCircle, Settings } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import ProductList from './ProductList';

const InventoryTab = ({ 
  products, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  hasLowStock, 
  lowStockCount, 
  totalStockValue, 
  handleCreateProduct, 
  handleEditProduct, 
  handleDeleteProduct, 
  handleQuickSale, 
  handleResetStock, 
  setIsSaleModalOpen, 
  setIsCategoryModalOpen, 
  setIsHelpModalOpen, 
  isLoading, 
  userRole 
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion du Stock</h1>
          <p className="text-slate-500 mt-1">Gérez vos produits et surveillez vos niveaux de stock.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHelpModalOpen(true)}
            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-slate-200"
            title="Comment ça marche ?"
          >
            <HelpCircle size={24} />
          </button>
          <button 
            onClick={() => setIsSaleModalOpen(true)}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
          >
            <ShoppingCart size={20} />
            Faire une vente
          </button>
          <button 
            onClick={handleCreateProduct}
            className="btn btn-primary shadow-primary-500/25 shadow-lg"
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories.map(c => c.nom)}
        />
        <button 
          onClick={() => setIsCategoryModalOpen(true)}
          className="btn btn-secondary py-2 px-3 flex items-center gap-2 text-sm shrink-0"
        >
          <Settings size={16} />
          Gérer les catégories
        </button>
      </div>

      {hasLowStock && (
        <div className="mb-6 bg-red-600 border-l-8 border-red-900 p-5 rounded-xl flex items-center gap-4 animate-bounce-short shadow-xl shadow-red-500/40">
          <div className="bg-white p-2 rounded-full shadow-inner">
            <AlertCircle className="text-red-600" size={28} />
          </div>
          <div>
            <p className="text-white text-lg font-black uppercase tracking-wider">Alerte Critique : Stock Insuffisant !</p>
            <p className="text-red-50 text-sm font-medium">Certains articles sont tombés sous leur seuil de sécurité respectif. Réapprovisionnez immédiatement.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-white">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Produits</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
        </div>
        <div className="card p-6 bg-white border-l-4 border-l-primary-500">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Valeur du Stock</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {totalStockValue.toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
          </p>
        </div>
        <div className={`card p-6 border-l-8 transition-all duration-500 ${
          hasLowStock 
          ? 'bg-red-50 border-red-600 animate-pulse shadow-lg ring-2 ring-red-600/20' 
          : 'bg-white border-amber-500'
        }`}>
          <p className={`text-sm font-bold uppercase tracking-wider ${hasLowStock ? 'text-red-600' : 'text-slate-500'}`}>
            Alerte Stock
          </p>
          <p className={`text-3xl font-black mt-2 ${hasLowStock ? 'text-red-700' : 'text-slate-900'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      <ProductList 
        products={products.filter(p => selectedCategory === 'Toutes' || p.categorie === selectedCategory)} 
        onEdit={handleEditProduct} 
        onDelete={handleDeleteProduct}
        onSell={handleQuickSale}
        onResetStock={handleResetStock}
        isLoading={isLoading}
        userRole={userRole}
      />
    </>
  );
};

export default InventoryTab;
