import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saleService, shopService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Receipt from '../components/Receipt';
import { Printer, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const TicketPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const { data } = await saleService.getById(id);
        setSale(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger le ticket');
      } finally {
        setLoading(false);
      }
    };

    const fetchShop = async () => {
      try {
        const { data } = await shopService.get();
        setShop(data);
      } catch (err) {
        console.error('Erreur chargement shop settings');
      }
    };

    fetchSale();
    fetchShop();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary-600 mb-4" size={48} />
        <p className="text-slate-600 font-medium">Chargement du ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto text-red-600 mb-6">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Erreur</h1>
          <p className="text-slate-500 mb-8">{error}</p>
          <button 
            onClick={() => navigate('/sales')}
            className="w-full flex items-center justify-center gap-2 btn btn-primary"
          >
            <ArrowLeft size={20} />
            Retour à l'historique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto no-print mb-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Transaction Validée
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Aperçu du Ticket</h1>
          <p className="text-slate-500 text-sm mb-6">
            Voici l'aperçu du ticket pour la transaction <strong>#{sale.id.slice(0, 8)}</strong>. 
            Vous pouvez l'imprimer sur une imprimante thermique 80mm.
          </p>
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-3 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98]"
          >
            <Printer size={24} />
            Imprimer le Ticket
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white shadow-2xl ring-1 ring-slate-200">
          <Receipt sale={sale} user={user} ref={receiptRef} />
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
