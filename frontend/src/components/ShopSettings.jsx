import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Upload, Save, CheckCircle2 } from 'lucide-react';

const ShopSettings = ({ settings, onUpdate, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    logo: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        address: settings.address || '',
        phone: settings.phone || '',
        logo: settings.logo || ''
      });
    }
  }, [settings]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Identité de la Boutique</h2>
            <p className="text-slate-500 text-sm">Ces informations apparaîtront sur vos reçus de vente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-32 h-32 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center mb-4 relative group">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Store size={48} className="text-slate-200" />
              )}
              <label className="absolute inset-0 bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
                <Upload size={20} className="mb-1" />
                CHANGER
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
            </div>
            <p className="text-xs text-slate-400 font-medium">Recommandé : Image carrée (PNG/JPG)</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom de l'Etablissement</label>
              <div className="relative">
                <Store className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  className="input pl-10 w-full"
                  placeholder="Ex: Boutique Al-Baraka"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse Physique</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input pl-10 w-full"
                  placeholder="Ex: Rue 10 x Lamine Gueye, Dakar"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Numéro de Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input pl-10 w-full"
                  placeholder="Ex: +221 77 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all shadow-lg ${
              saveSuccess 
              ? 'bg-emerald-500 text-white' 
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={20} />
                PARAMÈTRES ENREGISTRÉS
              </>
            ) : (
              <>
                <Save size={20} />
                ENREGISTRER LES MODIFICATIONS
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
