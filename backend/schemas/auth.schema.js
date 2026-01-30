import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().messages({
    "string.email": "Veuillez saisir une adresse email valide",
    "any.required": "L'adresse email est obligatoire",
  }),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("Administrateur", "vendeur").default("vendeur"),
  securityQuestion: Joi.string().allow("", null),
  securityAnswer: Joi.string().allow("", null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
