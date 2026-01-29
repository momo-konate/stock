import Joi from 'joi';

export const supplierSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom du fournisseur est obligatoire'
  }),
  phone: Joi.string().pattern(/^[0-9\+\s]{7,20}$/).allow(null, '').messages({
    'string.pattern.base': 'Numéro de téléphone invalide'
  }),
  email: Joi.string().email().allow(null, '').messages({
    'string.email': 'Email invalide'
  }),
  address: Joi.string().max(255).allow(null, ''),
  category: Joi.string().allow(null, '')
});
