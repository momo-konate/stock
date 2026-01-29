import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import Modal from './Modal';

const ClientModal = ({ isOpen, onClose, onSubmit, client, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idCardPhoto: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        idCardPhoto: client.idCardPhoto || ''
      });
    } else {
      setFormData({ name: '', phone: '', idCardPhoto: '' });
    }
  }, [client, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, idCardPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? "Modifier le client" : "Nouveau client"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom du client</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="ex: Mamadou Diop"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input"
            placeholder="ex: 77 123 45 67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Photo de la Carte d'Identité</label>
          <div className="flex items-center gap-4">
            <div className={`relative w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
              formData.idCardPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-primary-400'
            }`}>
              {formData.idCardPhoto ? (
                <>
                  <img src={formData.idCardPhoto} alt="ID Card" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, idCardPhoto: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-1 text-slate-400 hover:text-primary-500">
                  <Camera size={24} />
                  <span className="text-[10px] font-bold uppercase">Ajouter</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                {formData.idCardPhoto 
                  ? "Photo enregistrée avec succès. Elle sera utilisée pour authentifier le client en cas de litige."
                  : "Prenez une photo claire de la CNI du client pour sécuriser vos crédits et éviter les arnaques."
                }
              </p>
            </div>
          </div>
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
            className="btn btn-primary flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Opération...' : client ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;
