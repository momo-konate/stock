import express from 'express';
import { getClients, createClient, updateClient, deleteClient, addRepayment, getClientTransactions } from '../controllers/client.controller.js';
import { validate } from '../middleware/validation.js';
import { clientSchema } from '../schemas/client.schema.js';
import Joi from 'joi';

const repaymentSchema = Joi.object({
  amount: Joi.number().positive().required()
});

const router = express.Router();

// Protection gérée au niveau du serveur (server.js)
router.get('/', getClients);
router.post('/', validate(clientSchema), createClient);
router.put('/:id', validate(clientSchema), updateClient);
router.delete('/:id', deleteClient);
router.post('/:id/repayment', validate(repaymentSchema), addRepayment);
router.get('/:id/transactions', getClientTransactions);

export default router;
