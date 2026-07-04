import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/product.model.js", () => ({
  Product: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

import { Product } from "../models/product.model.js";
import * as productCtrl from "../controllers/product.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("product.controller", () => {
  it("getProducts sans filtre", async () => {
    Product.findAll.mockResolvedValue([{ id: "p1" }]);
    const res = mockRes();
    await productCtrl.getProducts({ query: {}, ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "p1" }]);
  });

  it("getProducts avec filtre catégorie", async () => {
    Product.findAll.mockResolvedValue([]);
    const res = mockRes();
    await productCtrl.getProducts({ query: { category: "Boissons" }, ownerId: "o1" }, res);
    expect(Product.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categorie: "Boissons" }),
      }),
    );
  });

  it("getProducts avec 'Toutes' ignore le filtre", async () => {
    Product.findAll.mockResolvedValue([]);
    const res = mockRes();
    await productCtrl.getProducts({ query: { category: "Toutes" }, ownerId: "o1" }, res);
    expect(Product.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "o1" } }),
    );
  });

  it("getProducts gère l'erreur", async () => {
    Product.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await productCtrl.getProducts({ query: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getCategories retourne les constantes", async () => {
    const res = mockRes();
    await productCtrl.getCategories({}, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ all: expect.anything() }),
    );
  });

  it("getCategories gère l'erreur", async () => {
    const res = mockRes();
    // Le 1er res.json (dans le try) lève -> on passe dans le catch.
    res.json.mockImplementationOnce(() => {
      throw boom;
    });
    await productCtrl.getCategories({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createProduct avec valeurs explicites", async () => {
    Product.create.mockResolvedValue({ id: "p1" });
    const res = mockRes();
    await productCtrl.createProduct(
      {
        body: { nom: "X", quantite: 5, prix: 100, alertThreshold: 3, categorie: "Bio" },
        ownerId: "o1",
      },
      res,
    );
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({ alertThreshold: 3, categorie: "Bio" }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createProduct avec valeurs par défaut", async () => {
    Product.create.mockResolvedValue({ id: "p2" });
    const res = mockRes();
    await productCtrl.createProduct({ body: { nom: "Y" }, ownerId: "o1" }, res);
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({ alertThreshold: 10, categorie: "Autre" }),
    );
  });

  it("createProduct gère l'erreur", async () => {
    Product.create.mockRejectedValue(boom);
    const res = mockRes();
    await productCtrl.createProduct({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updateProduct met à jour", async () => {
    const product = { update: vi.fn().mockResolvedValue({}) };
    Product.findOne.mockResolvedValue(product);
    const res = mockRes();
    await productCtrl.updateProduct(
      { params: { id: "p1" }, body: { nom: "Z" }, ownerId: "o1" },
      res,
    );
    expect(product.update).toHaveBeenCalled();
  });

  it("updateProduct retourne 404", async () => {
    Product.findOne.mockResolvedValue(null);
    const res = mockRes();
    await productCtrl.updateProduct({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateProduct gère l'erreur", async () => {
    Product.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await productCtrl.updateProduct({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteProduct supprime", async () => {
    const product = { destroy: vi.fn().mockResolvedValue({}) };
    Product.findOne.mockResolvedValue(product);
    const res = mockRes();
    await productCtrl.deleteProduct({ params: { id: "p1" }, ownerId: "o1" }, res);
    expect(product.destroy).toHaveBeenCalled();
  });

  it("deleteProduct retourne 404", async () => {
    Product.findOne.mockResolvedValue(null);
    const res = mockRes();
    await productCtrl.deleteProduct({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteProduct gère l'erreur", async () => {
    Product.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await productCtrl.deleteProduct({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
