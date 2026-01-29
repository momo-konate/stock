import express from 'express';
import { login, register, resetPassword, getSecurityQuestion, getUsers, deleteUser } from '../controllers/auth.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import Joi from 'joi';
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  answer: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/security-question/:email', getSecurityQuestion);

// Gestion des utilisateurs (Admin seulement)
router.get('/users', protect, admin, getUsers);
router.post('/users', protect, admin, validate(registerSchema), register);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
