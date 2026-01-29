import Joi from 'joi';

export const saleSchema = Joi.object({
  productId: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
    'any.required': 'Le produit est obligatoire'
  }),
  quantite: Joi.number().integer().min(1).required().messages({
    'number.min': 'La quantité vendue doit être d\'au moins 1'
  }),
  clientId: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null, ''),
  paiement: Joi.number().min(0).messages({
    'number.min': 'Le montant payé ne peut pas être négatif'
  })
});
