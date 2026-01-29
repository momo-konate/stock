import React, { useState } from 'react';
import Modal from './Modal';

const RepaymentModal = ({ isOpen, onClose, onSubmit, client, isLoading }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount);
    setAmount('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Remboursement - ${client?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Dette Actuelle</p>
          <p className="text-2xl font-black text-emerald-800">{client?.totalDebt.toLocaleString('fr-FR')} FCFA</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Montant du remboursement (FCFA)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            placeholder="ex: 5000"
            min="1"
            max={client?.totalDebt}
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Opération...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RepaymentModal;
