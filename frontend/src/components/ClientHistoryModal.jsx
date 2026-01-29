import React, { useState, useEffect } from 'react';
import { Calendar, ArrowDownCircle, ArrowUpCircle, History, X, Download } from 'lucide-react';
import Modal from './Modal';
import { clientService } from '../services/api';

const ClientHistoryModal = ({ isOpen, onClose, client }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      fetchTransactions();
    }
  }, [isOpen, client]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data } = await clientService.getTransactions(client.id);
      setTransactions(data);
    } catch (error) {
      console.error('Erreur fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Historique : ${client?.name}`}>
      <div className="space-y-6">
        {/* Résumé rapide */}
        <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solde Actuel</p>
            <p className={`text-2xl font-black ${client?.totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {client?.totalDebt.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <History className="text-primary-600" size={24} />
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          {isLoading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Chargement du grand livre...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 opacity-50 italic text-slate-500">
              Aucune transaction enregistrée pour le moment.
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between hover:border-primary-200 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${t.type === 'DEBT' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {t.type === 'DEBT' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.description}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black ${t.type === 'DEBT' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {t.type === 'DEBT' ? '+' : '-'} {t.amount.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400 leading-none">FCFA</p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="btn btn-secondary w-full py-3"
        >
          Fermer l'historique
        </button>
      </div>
    </Modal>
  );
};

export default ClientHistoryModal;
