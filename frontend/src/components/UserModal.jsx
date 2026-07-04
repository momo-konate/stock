import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, ShieldCheck, Edit3 } from 'lucide-react';

const UserModal = ({ isOpen, user, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'seller',
    securityQuestion: 'Quel est le nom de votre premier animal de compagnie ?',
    securityAnswer: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // On laisse vide car le mot de passe est optionnel à l'édition
        role: user.role || 'seller',
        securityQuestion: user.securityQuestion || 'Quel est le nom de votre premier animal de compagnie ?',
        securityAnswer: user.securityAnswer || ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'seller',
        securityQuestion: 'Quel est le nom de votre premier animal de compagnie ?',
        securityAnswer: ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Si on édite, on n'envoie le password que s'il est renseigné
    const submissionData = { ...formData };
    if (user && !submissionData.password) {
      delete submissionData.password;
    }
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-primary-600 p-6 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            {user ? <Edit3 size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-2xl font-bold">{user ? 'Modifier l\'accès' : 'Nouveau Vendeur'}</h2>
          <p className="text-primary-100 text-sm mt-1">
            {user ? `Modification du compte de ${user.username}` : 'Créez un accès pour un membre de votre équipe'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet / Identifiant</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="input pl-10 w-full rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Jean Paul"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                required
                className="input pl-10 w-full rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-500"
                placeholder="vendeur@nom.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {user ? 'Changer le mot de passe (optionnel)' : 'Mot de passe provisoire'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required={!user}
                className="input pl-10 w-full rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-500"
                placeholder={user ? "Laisser vide pour ne pas changer" : "••••••••"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rôle</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
              <select
                className="input pl-10 w-full rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-500 bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="seller">Vendeur (Accès Standard)</option>
                <option value="admin">Administrateur (Accès Complet)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? (user ? 'Mise à jour...' : 'Création...') : (user ? 'Enregistrer les changements' : 'Créer le compte')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
