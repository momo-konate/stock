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
import { useCategories } from './hooks/useCategories';
import ProductForm from './components/ProductForm';
import SaleForm from './components/SaleForm';
import Receipt from './components/Receipt';
import Modal from './components/Modal';
import SalesChart from './components/SalesChart';
import SalesList from './components/SalesList';
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
import CategoryManager from './components/CategoryManager';
import InventoryTab from './components/InventoryTab';
import SalesTab from './components/SalesTab';
import ExpensesTab from './components/ExpensesTab';
import ClientsTab from './components/ClientsTab';
import SuppliersTab from './components/SuppliersTab';
import * as XLSX from 'xlsx';
import { 
  AlertCircle, CheckCircle2, ShoppingCart, 
  Trash2, UserCircle, Settings, Users, Phone, TrendingUp, Truck, Menu, X, HelpCircle,
  Printer, Wallet, History, Plus
} from 'lucide-react';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate replace to="/login" />;
  return children;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    viewingSale, setViewingSale, isReceiptModalOpen, setIsReceiptModalOpen, 
    fetchSales, fetchDeletedSales, handleSaleSubmit, handleQuickSale, handleDeleteSale, handleDeleteAllSales 
  } = useSales(showToast, fetchClients, setProducts);

  const { 
    expenses, shop, isLoading: isSystemLoading, isSubmitLoading: isSystemSubmitLoading, 
    fetchExpenses, fetchShopSettings, handleExpenseSubmit, handleDeleteExpense, handleShopUpdate 
  } = useAppSystem(showToast);

  const { users, isSubmitLoading: isUserSubmitLoading, fetchUsers, handleUserSubmit, handleDeleteUser } = useUsers(showToast);
  const { suppliers, isLoading: isSuppliersLoading, isSubmitLoading: isSupplierSubmitLoading, fetchSuppliers, handleSupplierSubmit, handleDeleteSupplier } = useSuppliers(showToast);
  const { categories, isLoading: isCategoriesLoading, isSubmitLoading: isCategorySubmitLoading, fetchCategories, handleCategorySubmit, handleDeleteCategory } = useCategories(showToast);

  const isLoading = isProductsLoading || isSalesLoading || isClientsLoading || isSystemLoading || isSuppliersLoading || isCategoriesLoading;
  const isSubmitLoading = isProductSubmitLoading || isSaleSubmitLoading || isClientSubmitLoading || isSystemSubmitLoading || isUserSubmitLoading || isSupplierSubmitLoading || isCategorySubmitLoading;

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isClientHelpModalOpen, setIsClientHelpModalOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [idPreviewPhoto, setIdPreviewPhoto] = useState(null);

  // Effect to fetch products and sales when selectedCategory changes
  useEffect(() => {
    if (user) {
      const categoryName = selectedCategory === 'Toutes' ? null : selectedCategory;
      fetchProducts(categoryName);
      fetchSales(categoryName);
    }
  }, [selectedCategory, user, fetchProducts, fetchSales]);

  useEffect(() => {
    if (!user?.id) return;
    
    fetchProducts();
    fetchSales();
    fetchExpenses();
    fetchShopSettings();
    fetchClients();
    fetchSuppliers();
    fetchCategories();
    if (user?.role === 'admin') { 
      fetchDeletedSales();
      fetchUsers();
    }
  }, [user?.id, fetchProducts, fetchSales, fetchExpenses, fetchShopSettings, fetchClients, fetchDeletedSales, fetchUsers, fetchSuppliers, fetchCategories]);

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
  const handleCreateUser = (userToEdit = null) => {
    setSelectedUser(userToEdit);
    setIsUserModalOpen(true);
  };
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
    if (await handleUserSubmit(formData, selectedUser)) setIsUserModalOpen(false);
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

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {activeTab === 'inventory' && (
          <InventoryTab 
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            hasLowStock={hasLowStock}
            lowStockCount={lowStockCount}
            totalStockValue={totalStockValue}
            handleCreateProduct={handleCreateProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleQuickSale={handleQuickSale}
            handleResetStock={handleResetStock}
            setIsSaleModalOpen={setIsSaleModalOpen}
            setIsCategoryModalOpen={setIsCategoryModalOpen}
            setIsHelpModalOpen={setIsHelpModalOpen}
            isLoading={isLoading}
            userRole={user?.role}
          />
        )}
        
        {activeTab === 'sales' && (
          <SalesTab 
            sales={sales}
            handleExportExcel={handleExportExcel}
            handleDeleteAllSales={handleDeleteAllSales}
            setIsSaleModalOpen={setIsSaleModalOpen}
            onDeleteSale={(id) => handleDeleteSale(id, products)}
            isLoading={isLoading}
            user={user}
            setViewingSale={setViewingSale}
            setIsReceiptModalOpen={setIsReceiptModalOpen}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab 
            expenses={expenses}
            totalSalesValue={totalSalesValue}
            totalExpensesValue={totalExpensesValue}
            netBalance={netBalance}
            setIsExpenseModalOpen={setIsExpenseModalOpen}
            handleDeleteExpense={handleDeleteExpense}
            user={user}
            isSubmitLoading={isSubmitLoading}
          />
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
          <SuppliersTab 
            suppliers={suppliers}
            handleCreateSupplier={handleCreateSupplier}
            handleEditSupplier={handleEditSupplier}
            handleDeleteSupplier={handleDeleteSupplier}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsTab 
            clients={clients}
            handleCreateClient={handleCreateClient}
            handleEditClient={handleEditClient}
            handleDeleteClient={handleDeleteClient}
            handleRepayClientClick={handleRepayClientClick}
            setIsClientHelpModalOpen={setIsClientHelpModalOpen}
            setSelectedClient={setSelectedClient}
            setIdPreviewPhoto={setIdPreviewPhoto}
            setIsHistoryModalOpen={setIsHistoryModalOpen}
            isLoading={isLoading}
          />
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
          categories={categories}
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
        user={selectedUser}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={onUserSubmit}
        isLoading={isSubmitLoading}
      />

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Gestion des Catégories"
      >
        <CategoryManager
          categories={categories}
          onAdd={handleCategorySubmit}
          onUpdate={handleCategorySubmit}
          onDelete={handleDeleteCategory}
          isLoading={isCategorySubmitLoading}
        />
      </Modal>

      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Comment utiliser StockPro ? 🚀"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-primary-100 text-primary-600 p-3 rounded-full h-fit">
              <Plus size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">1. Remplissez votre Stock</h4>
              <p className="text-sm text-slate-500">Allez dans "Ajouter un produit" pour enregistrer vos articles avec leur prix et quantité.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full h-fit">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">2. Faites une Vente</h4>
              <p className="text-sm text-slate-500">Cliquez sur "Faire une vente". Le stock diminuera tout seul et l'argent ira dans votre caisse.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-violet-100 text-violet-600 p-3 rounded-full h-fit">
              <Wallet size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">3. Surveillez la Caisse</h4>
              <p className="text-sm text-slate-500">L'onglet "Caisse" vous montre vos bénéfices après avoir soustrait vos dépenses.</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-800 font-medium">💡 Astuce : Si un produit devient rouge, c'est qu'il est temps d'en racheter !</p>
          </div>

          <button 
            onClick={() => setIsHelpModalOpen(false)}
            className="w-full btn btn-primary py-3"
          >
            J'ai compris, c'est parti !
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isClientHelpModalOpen}
        onClose={() => setIsClientHelpModalOpen(false)}
        title="Gérer vos Clients & Dettes 🤝"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-primary-100 text-primary-600 p-3 rounded-full h-fit">
              <UserCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">1. Enregistrez vos Clients</h4>
              <p className="text-sm text-slate-500">Ajoutez vos clients réguliers pour pouvoir leur vendre à crédit.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-full h-fit">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">2. Suivez les Dettes</h4>
              <p className="text-sm text-slate-500">Lors d'une vente, choisissez "Dette". Elle apparaîtra automatiquement sur la fiche du client.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full h-fit">
              <History size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">3. Remboursements</h4>
              <p className="text-sm text-slate-500">Cliquez sur l'icône de billet (💸) pour enregistrer un paiement et réduire la dette.</p>
            </div>
          </div>

          <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
            <p className="text-xs text-primary-800 font-medium">📜 Astuce : Utilisez le bouton "Historique" pour voir tous les détails d'un client.</p>
          </div>

          <button 
            onClick={() => setIsClientHelpModalOpen(false)}
            className="w-full btn btn-primary py-3"
          >
            Compris !
          </button>
        </div>
      </Modal>

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
