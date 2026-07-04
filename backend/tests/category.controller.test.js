import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/category.model.js", () => ({
  Category: { findAll: vi.fn(), findOne: vi.fn(), create: vi.fn() },
}));

vi.mock("../models/product.model.js", () => ({
  Product: { findOne: vi.fn(), update: vi.fn() },
}));

import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import * as categoryCtrl from "../controllers/category.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("category.controller", () => {
  it("getCategories retourne les catégories", async () => {
    Category.findAll.mockResolvedValue([{ id: "c1" }]);
    const res = mockRes();
    await categoryCtrl.getCategories({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "c1" }]);
  });

  it("getCategories gère l'erreur", async () => {
    Category.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await categoryCtrl.getCategories({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createCategory crée une catégorie", async () => {
    Category.findOne.mockResolvedValue(null);
    Category.create.mockResolvedValue({ id: "c1", nom: "Boissons" });
    const res = mockRes();
    await categoryCtrl.createCategory({ body: { nom: "Boissons" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createCategory refuse un doublon", async () => {
    Category.findOne.mockResolvedValue({ id: "c1" });
    const res = mockRes();
    await categoryCtrl.createCategory({ body: { nom: "Boissons" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createCategory gère l'erreur", async () => {
    Category.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await categoryCtrl.createCategory({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updateCategory met à jour", async () => {
    const category = { nom: "Old", update: vi.fn().mockResolvedValue({}) };
    Category.findOne.mockResolvedValue(category);
    Product.update.mockResolvedValue([1]);
    const res = mockRes();
    await categoryCtrl.updateCategory(
      { params: { id: "c1" }, body: { nom: "New" }, ownerId: "o1" },
      res,
    );
    expect(category.update).toHaveBeenCalledWith({ nom: "New" });
  });

  it("updateCategory retourne 404", async () => {
    Category.findOne.mockResolvedValue(null);
    const res = mockRes();
    await categoryCtrl.updateCategory({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateCategory gère l'erreur", async () => {
    Category.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await categoryCtrl.updateCategory({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteCategory supprime", async () => {
    const category = { nom: "X", destroy: vi.fn().mockResolvedValue({}) };
    Category.findOne.mockResolvedValue(category);
    Product.findOne.mockResolvedValue(null);
    const res = mockRes();
    await categoryCtrl.deleteCategory({ params: { id: "c1" }, ownerId: "o1" }, res);
    expect(category.destroy).toHaveBeenCalled();
  });

  it("deleteCategory retourne 404", async () => {
    Category.findOne.mockResolvedValue(null);
    const res = mockRes();
    await categoryCtrl.deleteCategory({ params: { id: "x" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteCategory refuse si utilisée par un produit", async () => {
    Category.findOne.mockResolvedValue({ nom: "X" });
    Product.findOne.mockResolvedValue({ id: "p1" });
    const res = mockRes();
    await categoryCtrl.deleteCategory({ params: { id: "c1" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteCategory gère l'erreur", async () => {
    Category.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await categoryCtrl.deleteCategory({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
