import React from 'react';
import { User, Phone, Wallet, Edit2, Trash2, Plus, Eye, ShieldCheck, History } from 'lucide-react';

const ClientsList = ({ clients, onEdit, onDelete, onRepay, onCreateClient, onViewID, onHistory, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-40"></div>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Aucun client</h3>
        <p className="text-slate-500 mt-2">Enregistrez vos clients pour suivre leurs crédits.</p>
        <button 
          onClick={onCreateClient}
          className="mt-6 btn btn-primary"
        >
          <Plus size={18} />
          Ajouter un client
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <div key={client.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className={`p-3 rounded-xl cursor-pointer transition-transform hover:scale-110 active:scale-95 ${client.idCardPhoto ? 'bg-emerald-100 text-emerald-600 shadow-md' : 'bg-primary-50 text-primary-600'}`}
                  onClick={() => client.idCardPhoto && onViewID(client.idCardPhoto, client)}
                  title={client.idCardPhoto ? "Voir la pièce d'identité en grand" : "Aucune pièce d'identité"}
                >
                  {client.idCardPhoto ? (
                    <img src={client.idCardPhoto} alt="CNI" className="w-10 h-10 -m-3 max-w-none rounded-xl object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                {client.idCardPhoto && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-emerald-500">
                    <ShieldCheck size={12} fill="white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-lg text-slate-900">{client.name}</h3>
                </div>
                {client.phone && (
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone size={14} />
                    {client.phone}
                  </p>
                )}
              </div>
            </div>
            {client.totalDebt > 0 && (
              <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                Débiteur
              </span>
            )}
          </div>
          
          <div className={`p-4 rounded-xl mb-4 ${client.totalDebt > 0 ? 'bg-red-50 border border-red-100 shadow-inner' : 'bg-emerald-50 border border-emerald-100'}`}>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Balance Dette</span>
              <Wallet size={16} className={client.totalDebt > 0 ? 'text-red-500' : 'text-emerald-500'} />
            </div>
            <p className={`text-2xl font-black mt-1 ${client.totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {client.totalDebt.toLocaleString('fr-FR')} <span className="text-sm font-normal">FCFA</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onHistory(client)}
              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
              title="Historique des transactions"
            >
              <History size={18} />
            </button>
            {client.totalDebt > 0 && (
              <button 
                onClick={() => onRepay(client)}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                Rembourser
              </button>
            )}
            {onEdit && (
              <button 
                onClick={() => onEdit(client)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                title="Modifier"
              >
                <Edit2 size={18} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(client.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Supprimer"
                disabled={client.totalDebt > 0}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsList;
