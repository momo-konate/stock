import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/supplier.model.js", () => ({
  default: { findAll: vi.fn(), findOne: vi.fn(), create: vi.fn() },
}));

import Supplier from "../models/supplier.model.js";
import * as supplierCtrl from "../controllers/supplier.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("supplier.controller", () => {
  it("getSuppliers retourne la liste", async () => {
    Supplier.findAll.mockResolvedValue([{ id: "f1" }]);
    const res = mockRes();
    await supplierCtrl.getSuppliers({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "f1" }]);
  });

  it("getSuppliers gère l'erreur", async () => {
    Supplier.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await supplierCtrl.getSuppliers({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createSupplier crée", async () => {
    Supplier.create.mockResolvedValue({ id: "f1" });
    const res = mockRes();
    await supplierCtrl.createSupplier({ body: { name: "Fourn" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createSupplier gère l'erreur", async () => {
    Supplier.create.mockRejectedValue(boom);
    const res = mockRes();
    await supplierCtrl.createSupplier({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateSupplier met à jour", async () => {
    const supplier = { update: vi.fn().mockResolvedValue({}) };
    Supplier.findOne.mockResolvedValue(supplier);
    const res = mockRes();
    await supplierCtrl.updateSupplier({ params: { id: "f1" }, body: {}, ownerId: "o1" }, res);
    expect(supplier.update).toHaveBeenCalled();
  });

  it("updateSupplier retourne 404", async () => {
    Supplier.findOne.mockResolvedValue(null);
    const res = mockRes();
    await supplierCtrl.updateSupplier({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateSupplier gère l'erreur", async () => {
    Supplier.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await supplierCtrl.updateSupplier({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteSupplier supprime", async () => {
    const supplier = { destroy: vi.fn().mockResolvedValue({}) };
    Supplier.findOne.mockResolvedValue(supplier);
    const res = mockRes();
    await supplierCtrl.deleteSupplier({ params: { id: "f1" }, ownerId: "o1" }, res);
    expect(supplier.destroy).toHaveBeenCalled();
  });

  it("deleteSupplier retourne 404", async () => {
    Supplier.findOne.mockResolvedValue(null);
    const res = mockRes();
    await supplierCtrl.deleteSupplier({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteSupplier gère l'erreur", async () => {
    Supplier.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await supplierCtrl.deleteSupplier({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
