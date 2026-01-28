import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Database, AlertCircle, CheckCircle2, ShoppingCart, History } from 'lucide-react';
import { productService, saleService } from './services/api';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SalesList from './components/SalesList';
import SaleForm from './components/SaleForm';
import Modal from './components/Modal';

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'sales'
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await productService.getAll();
      setProducts(data);
    } catch (error) {
      showToast('Erreur lors du chargement des produits', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const { data } = await saleService.getAll();
      setSales(data);
    } catch (error) {
      console.error('Erreur chargement ventes', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p.id !== id));
        showToast('Produit supprimé avec succès');
      } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleProductSubmit = async (formData) => {
    setIsSubmitLoading(true);
    try {
      if (selectedProduct) {
        const { data } = await productService.update(selectedProduct.id, formData);
        setProducts(products.map(p => p.id === data.id ? data : p));
        showToast('Produit mis à jour avec succès');
      } else {
        const { data } = await productService.create(formData);
        setProducts([data, ...products]);
        showToast('Produit ajouté avec succès');
      }
      setIsProductModalOpen(false);
    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleSaleSubmit = async (formData) => {
    setIsSubmitLoading(true);
    try {
      const { data } = await saleService.create(formData);
      setSales([data, ...sales]);
      // Mettre à jour le stock localement
      setProducts(products.map(p => 
        p.id === formData.productId 
        ? { ...p, quantite: p.quantite - formData.quantite } 
        : p
      ));
      showToast('Vente enregistrée avec succès');
      setIsSaleModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Erreur lors de la vente', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteAllSales = async () => {
    if (window.confirm('Voulez-vous vraiment vider tout l\'historique des ventes ? Cette action est irréversible.')) {
      setIsLoading(true);
      try {
        await saleService.deleteAll();
        setSales([]);
        showToast('Historique des ventes vidé');
      } catch (error) {
        showToast('Erreur lors de la suppression de l\'historique', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalStockValue = products.reduce((acc, p) => acc + (p.prix * p.quantite), 0);
  const totalSalesValue = sales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <Database size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">StockPro</span>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'inventory' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Stock
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'sales' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Ventes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {activeTab === 'inventory' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion du Stock</h1>
                <p className="text-slate-500 mt-1">Gérez vos produits et surveillez vos niveaux de stock.</p>
              </div>
              <div className="flex gap-3">
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

            {products.some(p => p.quantite < 10) && (
              <div className="mb-6 bg-red-600 border-l-8 border-red-900 p-5 rounded-xl flex items-center gap-4 animate-bounce-short shadow-xl shadow-red-500/40">
                <div className="bg-white p-2 rounded-full shadow-inner">
                  <AlertCircle className="text-red-600" size={28} />
                </div>
                <div>
                  <p className="text-white text-lg font-black uppercase tracking-wider">Alerte Critique : Stock Insuffisant !</p>
                  <p className="text-red-50 text-sm font-medium">Certains articles sont tombés sous le seuil de sécurité (10 unités). Réapprovisionnez immédiatement.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 bg-white">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Produits</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
              </div>
              <div className="card p-6 bg-white border-l-4 border-l-primary-500">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Valeur Inventaire</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalStockValue.toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                </p>
              </div>
              <div className={`card p-6 border-l-8 transition-all duration-500 ${
                products.some(p => p.quantite < 10) 
                ? 'bg-red-50 border-red-600 animate-pulse shadow-lg ring-2 ring-red-600/20' 
                : 'bg-white border-amber-500'
              }`}>
                <p className={`text-sm font-bold uppercase tracking-wider ${products.some(p => p.quantite < 10) ? 'text-red-600' : 'text-slate-500'}`}>
                  Alerte Stock
                </p>
                <p className={`text-3xl font-black mt-2 ${products.some(p => p.quantite < 10) ? 'text-red-700' : 'text-slate-900'}`}>
                  {products.filter(p => p.quantite < 10 && p.quantite > 0).length}
                </p>
              </div>
            </div>

            <ProductList 
              products={products} 
              onEdit={handleEditProduct} 
              onDelete={handleDeleteProduct}
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Historique des Ventes</h1>
                <p className="text-slate-500 mt-1">Suivez vos transactions et votre chiffre d'affaires.</p>
              </div>
              <div className="flex gap-3">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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

            <SalesList sales={sales} isLoading={isLoading} />
          </>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}
      >
        <ProductForm 
          product={selectedProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => setIsProductModalOpen(false)}
          isLoading={isSubmitLoading}
        />
      </Modal>

      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="Effectuer une vente"
      >
        <SaleForm 
          products={products}
          onSubmit={handleSaleSubmit}
          onCancel={() => setIsSaleModalOpen(false)}
          isLoading={isSubmitLoading}
        />
      </Modal>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        &copy; 2026 StockPro Management System. Tous droits réservés.
      </footer>
    </div>
  );
};

// Petit composant helper local pour l'icône de tendance
const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default App;
