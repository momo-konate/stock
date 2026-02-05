import React from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import ClientsList from './ClientsList';

const ClientsTab = ({ 
  clients, 
  handleCreateClient, 
  handleEditClient, 
  handleDeleteClient, 
  handleRepayClientClick, 
  setIsClientHelpModalOpen, 
  setSelectedClient, 
  setIdPreviewPhoto, 
  setIsHistoryModalOpen, 
  isLoading 
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Clients</h1>
          <p className="text-slate-500 mt-1">Suivez les dettes et les remboursements de vos clients.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsClientHelpModalOpen(true)}
            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-slate-200"
            title="Aide Client"
          >
            <HelpCircle size={24} />
          </button>
          <button 
            onClick={handleCreateClient}
            className="btn btn-primary shadow-primary-500/25 shadow-lg"
          >
            <Plus size={20} />
            Nouveau Client
          </button>
        </div>
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
  );
};

export default ClientsTab;
