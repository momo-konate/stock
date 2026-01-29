import Joi from 'joi';

export const clientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom du client est obligatoire'
  }),
  phone: Joi.string().pattern(/^[0-9\+\s]{7,20}$/).allow(null, '').messages({
    'string.pattern.base': 'Format de numéro de téléphone invalide'
  }),
  idCardPhoto: Joi.string().uri().allow(null, '')
});
