import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/shop.model.js", () => ({
  Shop: { findOne: vi.fn(), create: vi.fn() },
}));

import { Shop } from "../models/shop.model.js";
import * as shopCtrl from "../controllers/shop.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("shop.controller", () => {
  it("getShopSettings retourne le shop existant", async () => {
    Shop.findOne.mockResolvedValue({ id: "sh1" });
    const res = mockRes();
    await shopCtrl.getShopSettings({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith({ id: "sh1" });
  });

  it("getShopSettings crée un profil par défaut", async () => {
    Shop.findOne.mockResolvedValue(null);
    Shop.create.mockResolvedValue({ id: "sh2" });
    const res = mockRes();
    await shopCtrl.getShopSettings({ ownerId: "o1" }, res);
    expect(Shop.create).toHaveBeenCalled();
  });

  it("getShopSettings gère l'erreur", async () => {
    Shop.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await shopCtrl.getShopSettings({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateShopSettings met à jour un shop existant", async () => {
    const shop = { update: vi.fn().mockResolvedValue({}) };
    Shop.findOne.mockResolvedValue(shop);
    const res = mockRes();
    await shopCtrl.updateShopSettings({ body: { name: "X" }, ownerId: "o1" }, res);
    expect(shop.update).toHaveBeenCalled();
  });

  it("updateShopSettings crée si absent", async () => {
    Shop.findOne.mockResolvedValue(null);
    Shop.create.mockResolvedValue({ id: "sh3" });
    const res = mockRes();
    await shopCtrl.updateShopSettings({ body: { name: "X" }, ownerId: "o1" }, res);
    expect(Shop.create).toHaveBeenCalled();
  });

  it("updateShopSettings gère l'erreur", async () => {
    Shop.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await shopCtrl.updateShopSettings({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
