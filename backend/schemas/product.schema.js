import Joi from 'joi';

export const productSchema = Joi.object({
  nom: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom du produit est obligatoire',
    'string.min': 'Le nom doit contenir au moins 2 caractères'
  }),
  prix: Joi.number().positive().required().messages({
    'number.base': 'Le prix doit être un nombre',
    'number.positive': 'Le prix doit être supérieur à 0'
  }),
  quantite: Joi.number().integer().min(0).required().messages({
    'number.min': 'La quantité ne peut pas être négative'
  }),
  categorie: Joi.string().required().messages({
    'string.empty': 'La catégorie est obligatoire'
  }),
  alertThreshold: Joi.number().integer().min(1).default(10)
});
