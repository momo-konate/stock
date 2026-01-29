import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const SaleForm = ({ products, clients, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantite: 1,
    clientId: '',
    paymentType: 'cash',
    amountPaid: ''
  });

  const selectedProduct = products.find(p => p.id === formData.productId);
  const totalAmount = selectedProduct ? selectedProduct.prix * formData.quantite : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || formData.quantite < 1) return;
    
    // Validation crédit
    if ((formData.paymentType === 'credit' || formData.paymentType === 'mixte') && !formData.clientId) {
      alert("Veuillez sélectionner un client pour une vente à crédit.");
      return;
    }

    const paid = formData.paymentType === 'cash' ? totalAmount : 
                 (formData.paymentType === 'credit' ? 0 : Number(formData.amountPaid));

    onSubmit({
      productId: formData.productId,
      quantite: Number(formData.quantite),
      clientId: formData.clientId || null,
      paymentType: formData.paymentType,
      amountPaid: paid
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sélectionner un produit</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className="input appearance-none bg-white"
          required
        >
          <option value="">Choisir un produit...</option>
          {products.filter(p => p.quantite > 0).map(product => (
            <option key={product.id} value={product.id}>
              {product.nom} - {product.prix.toLocaleString('fr-FR')} FCFA ({product.quantite} en stock)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantité</label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            className="input"
            min="1"
            max={selectedProduct ? selectedProduct.quantite : undefined}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mode de Paiement</label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="input bg-white"
          >
            <option value="cash">Espèces (Cash)</option>
            <option value="credit">Dette (Crédit Total)</option>
            <option value="mixte">Mixte (Acompte + Dette)</option>
          </select>
        </div>
      </div>

      {(formData.paymentType === 'credit' || formData.paymentType === 'mixte') && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sélectionner le Client</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="input bg-white"
            required
          >
            <option value="">Choisir un client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name} (Dette: {client.totalDebt} FCFA)</option>
            ))}
          </select>
        </div>
      )}

      {formData.paymentType === 'mixte' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Montant Payé ce jour (FCFA)</label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            className="input"
            min="0"
            max={totalAmount}
            placeholder="Ex: 2000"
            required
          />
        </div>
      )}

      {selectedProduct && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>Total à payer</span>
            <span>{totalAmount.toLocaleString('fr-FR')} FCFA</span>
          </div>
          {formData.paymentType !== 'cash' && (
            <div className="flex justify-between text-sm font-bold text-red-600 border-t border-slate-200 pt-1 mt-1">
              <span>Reste à payer (Dette)</span>
              <span>
                {(totalAmount - (formData.paymentType === 'credit' ? 0 : Number(formData.amountPaid))).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
          disabled={isLoading || !formData.productId}
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Traitement...' : 'Valider'}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;
