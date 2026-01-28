import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const SaleForm = ({ products, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantite: 1
  });

  const selectedProduct = products.find(p => p.id === formData.productId);

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
    onSubmit({
      productId: formData.productId,
      quantite: Number(formData.quantite)
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
              {product.nom} ({product.quantite} en stock) - {product.prix.toLocaleString('fr-FR')} FCFA
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Quantité à vendre</label>
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
        {selectedProduct && (
          <p className="mt-2 text-sm font-semibold text-primary-600">
            Total : {(selectedProduct.prix * formData.quantite).toLocaleString('fr-FR')} FCFA
          </p>
        )}
      </div>

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
          {isLoading ? 'Traitement...' : 'Valider la vente'}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;
