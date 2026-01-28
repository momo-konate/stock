import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    quantite: 0,
    prix: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom || '',
        description: product.description || '',
        quantite: product.quantite || 0,
        prix: product.prix || 0
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantite' || name === 'prix' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du produit</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className="input"
          placeholder="ex: Laptop Dell XPS"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input min-h-[100px]"
          placeholder="Description détaillée du produit..."
        />
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
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prix (FCFA)</label>
          <input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            className="input"
            min="0"
            step="0.01"
            required
          />
        </div>
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
          className="btn btn-primary flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Opération...' : product ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
