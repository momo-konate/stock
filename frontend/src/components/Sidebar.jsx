import React from 'react';
import { 
  Database, ShoppingCart, Wallet, Users, Truck, Trash2, UserCircle, Settings, LogOut, Menu, X, User as UserIcon
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user, logout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: 'inventory', label: 'Stock', icon: Database, color: 'text-primary-600' },
    { id: 'sales', label: 'Ventes', icon: ShoppingCart, color: 'text-emerald-600' },
    { id: 'expenses', label: 'Caisse', icon: Wallet, color: 'text-violet-600' },
    { id: 'clients', label: 'Clients', icon: Users, color: 'text-primary-600' },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck, color: 'text-amber-600' },
  ];

  const adminItems = [
    { id: 'trash', label: 'Corbeille', icon: Trash2, color: 'text-red-600' },
    { id: 'users', label: 'Personnel', icon: UserCircle, color: 'text-emerald-600' },
    { id: 'settings', label: 'Réglages', icon: Settings, color: 'text-slate-900' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Database size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">StockPro</span>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-white shadow-sm ' + item.color : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.id !== 'inventory' && item.id !== 'sales' && <item.icon size={16} />}
                {item.label}
              </button>
            ))}
            
            {user?.role === 'admin' && adminItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-white shadow-sm ' + item.color : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Bouton Menu Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Info Utilisateur Desktop */}
          <div className="hidden md:flex items-center gap-4">
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

        {/* Menu Mobile Déroulant */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            {[...menuItems, ...(user?.role === 'admin' ? adminItems : [])].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-primary-50 border-l-4 border-primary-600 ' + item.color : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-200 p-1.5 rounded-full">
                    <UserIcon size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-700">{user?.username}</span>
                    {user?.role === 'admin' && (
                      <span className="ml-2 px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black rounded uppercase">Admin</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => { if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) logout(); }}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
