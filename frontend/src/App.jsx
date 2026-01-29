import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TicketPage from './pages/TicketPage';
import { 
  productService, saleService, expenseService, authService, shopService, clientService 
} from './services/api';
import { useProducts } from './hooks/useProducts';
import { useSales } from './hooks/useSales';
import { useClients } from './hooks/useClients';
import { useAppSystem } from './hooks/useAppSystem';
import { useUsers } from './hooks/useUsers';
import { useSuppliers } from './hooks/useSuppliers';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SalesList from './components/SalesList';
import SaleForm from './components/SaleForm';
import Receipt from './components/Receipt';
import Modal from './components/Modal';
import SalesChart from './components/SalesChart';
import UsersList from './components/UsersList';
import UserModal from './components/UserModal';
import ShopSettings from './components/ShopSettings';
import ClientsList from './components/ClientsList';
import ClientModal from './components/ClientModal';
import RepaymentModal from './components/RepaymentModal';
import ImageViewer from './components/ImageViewer';
import ClientHistoryModal from './components/ClientHistoryModal';
import SuppliersList from './components/SuppliersList';
import SupplierForm from './components/SupplierForm';
import * as XLSX from 'xlsx';
import { 
  Plus, LayoutDashboard, Database, AlertCircle, CheckCircle2, ShoppingCart, 
  History, LogOut, User as UserIcon, Trash2, Wallet, Printer, 
  FileSpreadsheet, BarChart3, UserCircle, Shield, Settings, Users, Phone, TrendingUp, Truck
} from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate replace to="/login" />;
  return children;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // System Hooks
  const { 
    clients, isLoading: isClientsLoading, isSubmitLoading: isClientSubmitLoading, 
    fetchClients, handleClientSubmit, handleDeleteClient, handleRepayClient 
  } = useClients(showToast);
  
  const { 
    products, setProducts, isLoading: isProductsLoading, isSubmitLoading: isProductSubmitLoading, 
    fetchProducts, handleProductSubmit, handleDeleteProduct 
  } = useProducts(showToast);
  
  const { 
    sales, deletedSales, isLoading: isSalesLoading, isSubmitLoading: isSaleSubmitLoading, 
    viewingSale, isReceiptModalOpen, setIsReceiptModalOpen, 
    fetchSales, fetchDeletedSales, handleSaleSubmit, handleQuickSale, handleDeleteSale, handleDeleteAllSales 
  } = useSales(showToast, fetchClients, setProducts);

  const { 
    expenses, shop, isLoading: isSystemLoading, isSubmitLoading: isSystemSubmitLoading, 
    fetchExpenses, fetchShopSettings, handleExpenseSubmit, handleDeleteExpense, handleShopUpdate 
  } = useAppSystem(showToast);

  const { users, isSubmitLoading: isUserSubmitLoading, fetchUsers, handleUserSubmit, handleDeleteUser } = useUsers(showToast);
  const { suppliers, isLoading: isSuppliersLoading, isSubmitLoading: isSupplierSubmitLoading, fetchSuppliers, handleSupplierSubmit, handleDeleteSupplier } = useSuppliers(showToast);

  const isLoading = isProductsLoading || isSalesLoading || isClientsLoading || isSystemLoading || isSuppliersLoading;
  const isSubmitLoading = isProductSubmitLoading || isSaleSubmitLoading || isClientSubmitLoading || isSystemSubmitLoading || isUserSubmitLoading || isSupplierSubmitLoading;

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [idPreviewPhoto, setIdPreviewPhoto] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchExpenses();
    fetchShopSettings();
    fetchClients();
    fetchSuppliers();
    if (user?.role === 'admin') { 
      fetchDeletedSales();
      fetchUsers();
    }
  }, [user, fetchProducts, fetchSales, fetchExpenses, fetchShopSettings, fetchClients, fetchDeletedSales, fetchUsers, fetchSuppliers]);

  useEffect(() => {
    if (activeTab === 'trash') {
      fetchDeletedSales();
    }
    if (activeTab === 'suppliers') {
      fetchSuppliers();
    }
  }, [activeTab, fetchDeletedSales, fetchSuppliers]);

  // UI Handlers (Shortcuts)
  const handleEditProduct = (product) => { setSelectedProduct(product); setIsProductModalOpen(true); };
  const handleCreateProduct = () => { setSelectedProduct(null); setIsProductModalOpen(true); };
  const handleEditClient = (client) => { setSelectedClient(client); setIsClientModalOpen(true); };
  const handleCreateClient = () => { setSelectedClient(null); setIsClientModalOpen(true); };
  const handleRepayClientClick = (client) => { setSelectedClient(client); setIsRepaymentModalOpen(true); };
  const handleCreateUser = () => setIsUserModalOpen(true);
  const handleEditSupplier = (supplier) => { setSelectedSupplier(supplier); setIsSupplierModalOpen(true); };
  const handleCreateSupplier = () => { setSelectedSupplier(null); setIsSupplierModalOpen(true); };

  const onProductSubmit = async (formData) => {
    if (await handleProductSubmit(formData, selectedProduct)) setIsProductModalOpen(false);
  };

  const onSaleSubmit = async (formData) => {
    if (await handleSaleSubmit(formData, products)) setIsSaleModalOpen(false);
  };

  const onClientSubmit = async (formData) => {
    if (await handleClientSubmit(formData, selectedClient)) setIsClientModalOpen(false);
  };

  const onExpenseSubmit = async (formData) => {
    if (await handleExpenseSubmit(formData)) setIsExpenseModalOpen(false);
  };

  const onUserSubmit = async (formData) => {
    if (await handleUserSubmit(formData)) setIsUserModalOpen(false);
  };

  const onSupplierSubmit = async (formData) => {
    if (await handleSupplierSubmit(formData, selectedSupplier)) setIsSupplierModalOpen(false);
  };

  const onRepaySubmit = async (amount) => {
    if (await handleRepayClient(selectedClient.id, amount)) setIsRepaymentModalOpen(false);
  };

  const handleResetStock = async (id) => {
     if (window.confirm('Voulez-vous vraiment vider le stock ?')) {
       const p = products.find(p => p.id === id);
       if (p) {
         await handleProductSubmit({ ...p, quantite: 0 }, p);
       }
     }
  };

  // Excel Export Handler
  const handleExportExcel = () => {
    if (sales.length === 0) {
      showToast('Aucune vente à exporter', 'error');
      return;
    }

    const exportData = sales.map(sale => ({
      ID: sale.id.slice(0, 8),
      Date: new Date(sale.dateVente || sale.date).toLocaleString('fr-FR'),
      Produit: sale.productName,
      'Quantité': sale.quantite,
      'Prix Unitaire': (sale.total / sale.quantite).toLocaleString('fr-FR') + ' FCFA',
      'Total': sale.total.toLocaleString('fr-FR') + ' FCFA'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventes_StockPro");
    XLSX.writeFile(wb, `Rapport_Ventes_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Fichier Excel généré !');
  };

  // Calculations
  const hasLowStock = products.some(p => p.quantite < (p.alertThreshold || 10));
  const lowStockCount = products.filter(p => p.quantite < (p.alertThreshold || 10) && p.quantite > 0).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.prix * p.quantite), 0);
  const totalSalesValue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpensesValue = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalSalesValue - totalExpensesValue;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <Database size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">StockPro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'inventory' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Stock
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'sales' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Ventes
              </button>
              <button 
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'expenses' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Wallet size={16} />
                Caisse
              </button>
              <button 
                onClick={() => setActiveTab('clients')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'clients' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users size={16} />
                Clients
              </button>
              <button 
                onClick={() => setActiveTab('suppliers')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'suppliers' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Truck size={16} />
                Fournisseurs
              </button>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setActiveTab('trash')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'trash' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Trash2 size={16} />
                  Corbeille
                </button>
              )}
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'users' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UserCircle size={16} />
                  Personnel
                </button>
              )}
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Settings size={16} />
                  Réglages
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="bg-slate-200 p-1 rounded-full">
                  <UserIcon size={14} className="text-slate-600" />
                </div>
                <span className="text-xs font-bold text-slate-700">{user?.username}</span>
                {user?.role === 'admin' && (
                  <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black rounded uppercase">Admin</span>
                )}
              </div>
              <button 
                onClick={() => {
                  if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
                    logout();
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {activeTab === 'inventory' && (
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

            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              {['Tous', 'Boissons', 'Alimentation', 'Électronique', 'Vêtements', 'Hygiène', 'Divertissement', 'Général', 'Autre'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500/20' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Valeur Inventaire</p>
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
              products={products.filter(p => selectedCategory === 'Tous' || p.categorie === selectedCategory)} 
              onEdit={handleEditProduct} 
              onDelete={handleDeleteProduct}
              onSell={handleQuickSale}
              onResetStock={handleResetStock}
              isLoading={isLoading}
              userRole={user?.role}
            />
          </>
        )}
        
        {activeTab === 'sales' && (
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
              {/* Stats Cards Column */}
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

              {/* Chart Column */}
              <div className="lg:col-span-2">
                <SalesChart sales={sales} />
              </div>
            </div>

            <SalesList 
              sales={sales} 
              isLoading={isLoading} 
              onViewTicket={(sale) => {
                setViewingSale(sale);
                setIsReceiptModalOpen(true);
              }}
              onDeleteSale={handleDeleteSale}
              userRole={user?.role}
            />
          </>
        )}

        {activeTab === 'expenses' && (
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
        )}

        {activeTab === 'trash' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Corbeille</h1>
                <p className="text-slate-500 mt-1">Ventes supprimées et archives.</p>
              </div>
            </div>
            <SalesList sales={deletedSales} isLoading={isLoading} />
          </>
        )}

        {activeTab === 'users' && user?.role === 'admin' && (
          <UsersList 
            users={users} 
            isLoading={isLoading} 
            onDeleteUser={handleDeleteUser}
            onCreateUser={handleCreateUser}
          />
        )}

        {activeTab === 'settings' && user?.role === 'admin' && (
          <ShopSettings 
            settings={shop}
            onUpdate={handleShopUpdate}
            isLoading={isSubmitLoading}
          />
        )}

        {activeTab === 'suppliers' && (
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
        )}

        {activeTab === 'clients' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Clients</h1>
                <p className="text-slate-500 mt-1">Suivez les dettes et les remboursements de vos clients.</p>
              </div>
              <button 
                onClick={handleCreateClient}
                className="btn btn-primary shadow-primary-500/25 shadow-lg"
              >
                <Plus size={20} />
                Nouveau Client
              </button>
            </div>

            <ClientsList 
              clients={clients} 
              onEdit={handleEditClient} 
              onDelete={handleDeleteClient}
              onRepay={handleRepayClientClick}
              onCreateClient={handleCreateClient}
              onViewID={(idPhoto, client) => {
                setSelectedClient(client);
                setIdPreviewPhoto(idPhoto);
              }}
              onHistory={(client) => {
                setSelectedClient(client);
                setIsHistoryModalOpen(true);
              }}
              isLoading={isLoading}
            />
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
          onSubmit={onProductSubmit}
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
          clients={clients}
          onSubmit={onSaleSubmit}
          onCancel={() => setIsSaleModalOpen(false)}
          isLoading={isSubmitLoading}
        />
      </Modal>

      <ClientModal 
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSubmit={onClientSubmit}
        client={selectedClient}
        isLoading={isSubmitLoading}
      />

      <RepaymentModal 
        isOpen={isRepaymentModalOpen}
        onClose={() => setIsRepaymentModalOpen(false)}
        onSubmit={onRepaySubmit}
        client={selectedClient}
        isLoading={isSubmitLoading}
      />

      <ImageViewer 
        isOpen={!!idPreviewPhoto}
        onClose={() => setIdPreviewPhoto(null)}
        imageUrl={idPreviewPhoto}
        clientName={selectedClient?.name || ''}
      />

      <ClientHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        client={selectedClient}
      />
      
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Nouvelle Dépense"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleExpenseSubmit({
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount'))
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motif</label>
            <input name="description" required className="w-full rounded-lg border-slate-300 border p-2" placeholder="Ex: Facture Senelec" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Montant (FCFA)</label>
            <input name="amount" type="number" required min="1" className="w-full rounded-lg border-slate-300 border p-2" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={isSubmitLoading} className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/20">
              {isSubmitLoading ? '...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title={selectedSupplier ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}
      >
        <SupplierForm 
          supplier={selectedSupplier}
          onSubmit={onSupplierSubmit}
          onCancel={() => setIsSupplierModalOpen(false)}
          isLoading={isSubmitLoading}
        />
      </Modal>

      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Détail de la Transaction"
      >
        <div className="flex flex-col items-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 w-full max-h-[60vh] overflow-y-auto">
             <Receipt sale={viewingSale} user={user} shop={shop} />
          </div>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsReceiptModalOpen(false)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all font-sans"
            >
              Fermer
            </button>
            <button 
              onClick={() => {
                const win = window.open(`/ticket/${viewingSale.id}`, '_blank');
                win.focus();
              }}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 font-sans"
            >
              <Printer size={20} />
              Imprimer
            </button>
          </div>
        </div>
      </Modal>

      {/* Hidden Receipt for Printing (Legacy) */}
      <div id="printable-receipt" className="hidden">
        {viewingSale && <Receipt sale={viewingSale} user={user} shop={shop} />}
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={onUserSubmit}
        isLoading={isSubmitLoading}
      />

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white mt-auto">
        &copy; 2026 StockPro Management System. Tous droits réservés.
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/ticket/:id" element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
