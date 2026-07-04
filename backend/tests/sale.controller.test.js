import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/product.model.js", () => ({
  Product: { findOne: vi.fn(), update: vi.fn() },
  sequelize: { transaction: vi.fn() },
}));

vi.mock("../models/sale.model.js", () => ({
  Sale: { findAll: vi.fn(), findOne: vi.fn(), create: vi.fn(), destroy: vi.fn() },
}));

vi.mock("../models/client.model.js", () => ({
  Client: { findOne: vi.fn() },
}));

vi.mock("../models/clientTransaction.model.js", () => ({
  ClientTransaction: { create: vi.fn(), destroy: vi.fn() },
}));

import { Product, sequelize } from "../models/product.model.js";
import { Sale } from "../models/sale.model.js";
import { Client } from "../models/client.model.js";
import { ClientTransaction } from "../models/clientTransaction.model.js";
import * as saleCtrl from "../controllers/sale.controller.js";

describe("sale.controller", () => {
  let t;
  beforeEach(() => {
    vi.clearAllMocks();
    t = { commit: vi.fn().mockResolvedValue({}), rollback: vi.fn().mockResolvedValue({}) };
    sequelize.transaction.mockResolvedValue(t);
  });

  it("getSales sans filtre", async () => {
    Sale.findAll.mockResolvedValue([{ id: "s1" }]);
    const res = mockRes();
    await saleCtrl.getSales({ query: {}, ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "s1" }]);
  });

  it("getSales avec filtre catégorie", async () => {
    Sale.findAll.mockResolvedValue([]);
    const res = mockRes();
    await saleCtrl.getSales({ query: { category: "Bio" }, ownerId: "o1" }, res);
    expect(Sale.findAll).toHaveBeenCalled();
  });

  it("getSales gère l'erreur", async () => {
    Sale.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.getSales({ query: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getDeletedSales retourne la corbeille", async () => {
    Sale.findAll.mockResolvedValue([{ id: "s1" }]);
    const res = mockRes();
    await saleCtrl.getDeletedSales({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "s1" }]);
  });

  it("getDeletedSales gère l'erreur", async () => {
    Sale.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.getDeletedSales({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createSale au comptant (cash)", async () => {
    const product = { nom: "Prod", prix: 100, quantite: 10, update: vi.fn().mockResolvedValue({}) };
    Product.findOne.mockResolvedValue(product);
    Sale.create.mockResolvedValue({ id: "s1" });
    const res = mockRes();
    await saleCtrl.createSale({ body: { productId: "p1", quantite: 2 }, ownerId: "o1" }, res);
    expect(Sale.create).toHaveBeenCalledWith(
      expect.objectContaining({ paymentStatus: "paid", amountPaid: 200 }),
      expect.anything(),
    );
    expect(t.commit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createSale à crédit (unpaid) avec client et transaction de dette", async () => {
    const product = { nom: "Prod", prix: 100, quantite: 10, update: vi.fn().mockResolvedValue({}) };
    const client = { totalDebt: 50, update: vi.fn().mockResolvedValue({}) };
    Product.findOne.mockResolvedValue(product);
    Client.findOne.mockResolvedValue(client);
    Sale.create.mockResolvedValue({ id: "s2" });
    ClientTransaction.create.mockResolvedValue({});
    const res = mockRes();
    await saleCtrl.createSale(
      { body: { productId: "p1", quantite: 2, clientId: "cl1", paymentType: "credit" }, ownerId: "o1" },
      res,
    );
    expect(client.update).toHaveBeenCalledWith({ totalDebt: 250 }, expect.anything());
    expect(ClientTransaction.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createSale paiement partiel", async () => {
    const product = { nom: "Prod", prix: 100, quantite: 10, update: vi.fn().mockResolvedValue({}) };
    const client = { totalDebt: 0, update: vi.fn().mockResolvedValue({}) };
    Product.findOne.mockResolvedValue(product);
    Client.findOne.mockResolvedValue(client);
    Sale.create.mockResolvedValue({ id: "s3" });
    ClientTransaction.create.mockResolvedValue({});
    const res = mockRes();
    await saleCtrl.createSale(
      { body: { productId: "p1", quantite: 2, clientId: "cl1", amountPaid: 100 }, ownerId: "o1" },
      res,
    );
    expect(Sale.create).toHaveBeenCalledWith(
      expect.objectContaining({ paymentStatus: "partial" }),
      expect.anything(),
    );
  });

  it("createSale retourne 404 si produit non trouvé", async () => {
    Product.findOne.mockResolvedValue(null);
    const res = mockRes();
    await saleCtrl.createSale({ body: { productId: "x", quantite: 1 }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("createSale retourne 400 si stock insuffisant", async () => {
    Product.findOne.mockResolvedValue({ nom: "P", prix: 10, quantite: 1 });
    const res = mockRes();
    await saleCtrl.createSale({ body: { productId: "p1", quantite: 5 }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createSale retourne 400 si crédit sans client", async () => {
    Product.findOne.mockResolvedValue({ nom: "P", prix: 100, quantite: 10 });
    const res = mockRes();
    await saleCtrl.createSale(
      { body: { productId: "p1", quantite: 2, paymentType: "credit" }, ownerId: "o1" },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createSale retourne 404 si client non trouvé", async () => {
    Product.findOne.mockResolvedValue({ nom: "P", prix: 100, quantite: 10 });
    Client.findOne.mockResolvedValue(null);
    const res = mockRes();
    await saleCtrl.createSale(
      { body: { productId: "p1", quantite: 2, clientId: "x", paymentType: "credit" }, ownerId: "o1" },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("createSale rollback en cas d'erreur", async () => {
    Product.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.createSale({ body: { productId: "p1", quantite: 2 }, ownerId: "o1" }, res);
    expect(t.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteAllSales vide l'historique", async () => {
    Sale.destroy.mockResolvedValue(3);
    const res = mockRes();
    await saleCtrl.deleteAllSales({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });

  it("deleteAllSales gère l'erreur", async () => {
    Sale.destroy.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.deleteAllSales({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getSaleById retourne la vente", async () => {
    Sale.findOne.mockResolvedValue({ id: "s1" });
    const res = mockRes();
    await saleCtrl.getSaleById({ params: { id: "s1" }, ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith({ id: "s1" });
  });

  it("getSaleById retourne 404", async () => {
    Sale.findOne.mockResolvedValue(null);
    const res = mockRes();
    await saleCtrl.getSaleById({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getSaleById gère l'erreur", async () => {
    Sale.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.getSaleById({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteSale restaure le stock (produit trouvé)", async () => {
    const sale = { productId: "p1", quantite: 2, total: 200, amountPaid: 200, destroy: vi.fn().mockResolvedValue({}) };
    const product = { quantite: 5, update: vi.fn().mockResolvedValue({}) };
    Sale.findOne.mockResolvedValue(sale);
    Product.findOne.mockResolvedValue(product);
    const res = mockRes();
    await saleCtrl.deleteSale({ params: { id: "s1" }, ownerId: "o1" }, res);
    expect(product.update).toHaveBeenCalledWith({ quantite: 7 }, expect.anything());
    expect(sale.destroy).toHaveBeenCalled();
    expect(t.commit).toHaveBeenCalled();
  });

  it("deleteSale restaure la dette client et supprime la transaction associée", async () => {
    const sale = {
      id: "s1",
      productId: "p1",
      quantite: 2,
      total: 200,
      amountPaid: 50,
      clientId: "cl1",
      destroy: vi.fn().mockResolvedValue({}),
    };
    const product = { quantite: 5, update: vi.fn().mockResolvedValue({}) };
    const client = { totalDebt: 300, update: vi.fn().mockResolvedValue({}) };
    
    Sale.findOne.mockResolvedValue(sale);
    Product.findOne.mockResolvedValue(product);
    Client.findOne.mockResolvedValue(client);
    ClientTransaction.destroy.mockResolvedValue(1);
    
    const res = mockRes();
    await saleCtrl.deleteSale({ params: { id: "s1" }, ownerId: "o1" }, res);
    
    expect(client.update).toHaveBeenCalledWith({ totalDebt: 150 }, expect.anything());
    expect(ClientTransaction.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { saleId: "s1", type: "DEBT" } }),
    );
    expect(sale.destroy).toHaveBeenCalled();
  });

  it("deleteSale sans produit associé", async () => {
    const sale = { productId: "p1", quantite: 2, destroy: vi.fn().mockResolvedValue({}) };
    Sale.findOne.mockResolvedValue(sale);
    Product.findOne.mockResolvedValue(null);
    const res = mockRes();
    await saleCtrl.deleteSale({ params: { id: "s1" }, ownerId: "o1" }, res);
    expect(sale.destroy).toHaveBeenCalled();
  });

  it("deleteSale retourne 404", async () => {
    Sale.findOne.mockResolvedValue(null);
    const res = mockRes();
    await saleCtrl.deleteSale({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteSale rollback en cas d'erreur", async () => {
    Sale.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await saleCtrl.deleteSale({ params: {}, ownerId: "o1" }, res);
    expect(t.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
