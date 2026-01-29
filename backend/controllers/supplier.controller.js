import Supplier from '../models/supplier.model.js';

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { ownerId: req.ownerId },
      order: [['name', 'ASC']]
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des fournisseurs' });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      ownerId: req.ownerId
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du fournisseur' });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, ownerId: req.ownerId }
    });
    if (!supplier) return res.status(404).json({ message: 'Fournisseur non trouvé' });

    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, ownerId: req.ownerId }
    });
    if (!supplier) return res.status(404).json({ message: 'Fournisseur non trouvé' });

    await supplier.destroy();
    res.json({ message: 'Fournisseur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
