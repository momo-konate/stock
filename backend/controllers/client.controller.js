/**
 * Controller Client
 * Gère les clients et leur dette (crédit). `addRepayment` enregistre un
 * remboursement et trace l'opération dans ClientTransaction.
 */
import { Client } from '../models/client.model.js';
import { ClientTransaction } from '../models/clientTransaction.model.js';

export const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { userId: req.ownerId } });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, phone, idCardPhoto } = req.body;
    const client = await Client.create({
      name,
      phone,
      idCardPhoto,
      userId: req.ownerId
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du client', error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, idCardPhoto } = req.body;
    const client = await Client.findOne({ where: { id, userId: req.ownerId } });
    
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    await client.update({ name, phone, idCardPhoto });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

export const addRepayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // Montant remboursé
    
    const client = await Client.findOne({ where: { id, userId: req.ownerId } });
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    // Réduire la dette
    const newDebt = Math.max(0, client.totalDebt - Number(amount));
    await client.update({ totalDebt: newDebt });
    
    // Loguer la transaction
    await ClientTransaction.create({
      clientId: id,
      type: 'PAYMENT',
      amount: Number(amount),
      description: 'Remboursement de dette',
      date: new Date()
    });
    
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors du remboursement', error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOne({ where: { id, userId: req.ownerId } });
    
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    // On peut empêcher la suppression s'il y a une dette
    if (client.totalDebt > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer un client ayant une dette active' });
    }
    
    await client.destroy();
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

export const getClientTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier d'abord que le client appartient à l'utilisateur
    const client = await Client.findOne({ where: { id, userId: req.ownerId } });
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé ou accès non autorisé' });
    }

    const transactions = await ClientTransaction.findAll({
      where: { clientId: id },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error: error.message });
  }
};
