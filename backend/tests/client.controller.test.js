import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/client.model.js", () => ({
  Client: { findAll: vi.fn(), findOne: vi.fn(), create: vi.fn() },
}));

vi.mock("../models/clientTransaction.model.js", () => ({
  ClientTransaction: { findAll: vi.fn(), create: vi.fn() },
}));

import { Client } from "../models/client.model.js";
import { ClientTransaction } from "../models/clientTransaction.model.js";
import * as clientCtrl from "../controllers/client.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("client.controller", () => {
  it("getClients retourne la liste", async () => {
    Client.findAll.mockResolvedValue([{ id: "cl1" }]);
    const res = mockRes();
    await clientCtrl.getClients({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "cl1" }]);
  });

  it("getClients gère l'erreur", async () => {
    Client.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.getClients({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createClient crée", async () => {
    Client.create.mockResolvedValue({ id: "cl1" });
    const res = mockRes();
    await clientCtrl.createClient({ body: { name: "Ali" }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createClient gère l'erreur", async () => {
    Client.create.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.createClient({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updateClient met à jour", async () => {
    const client = { update: vi.fn().mockResolvedValue({}) };
    Client.findOne.mockResolvedValue(client);
    const res = mockRes();
    await clientCtrl.updateClient({ params: { id: "cl1" }, body: {}, ownerId: "o1" }, res);
    expect(client.update).toHaveBeenCalled();
  });

  it("updateClient retourne 404", async () => {
    Client.findOne.mockResolvedValue(null);
    const res = mockRes();
    await clientCtrl.updateClient({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateClient gère l'erreur", async () => {
    Client.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.updateClient({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("addRepayment réduit la dette et loggue", async () => {
    const client = { totalDebt: 500, update: vi.fn().mockResolvedValue({}) };
    Client.findOne.mockResolvedValue(client);
    ClientTransaction.create.mockResolvedValue({});
    const res = mockRes();
    await clientCtrl.addRepayment(
      { params: { id: "cl1" }, body: { amount: 200 }, ownerId: "o1" },
      res,
    );
    expect(client.update).toHaveBeenCalledWith({ totalDebt: 300 });
    expect(ClientTransaction.create).toHaveBeenCalled();
  });

  it("addRepayment retourne 404", async () => {
    Client.findOne.mockResolvedValue(null);
    const res = mockRes();
    await clientCtrl.addRepayment({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("addRepayment gère l'erreur", async () => {
    Client.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.addRepayment({ params: {}, body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteClient supprime", async () => {
    const client = { totalDebt: 0, destroy: vi.fn().mockResolvedValue({}) };
    Client.findOne.mockResolvedValue(client);
    const res = mockRes();
    await clientCtrl.deleteClient({ params: { id: "cl1" }, ownerId: "o1" }, res);
    expect(client.destroy).toHaveBeenCalled();
  });

  it("deleteClient retourne 404", async () => {
    Client.findOne.mockResolvedValue(null);
    const res = mockRes();
    await clientCtrl.deleteClient({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteClient refuse si dette active", async () => {
    Client.findOne.mockResolvedValue({ totalDebt: 100 });
    const res = mockRes();
    await clientCtrl.deleteClient({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteClient gère l'erreur", async () => {
    Client.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.deleteClient({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getClientTransactions retourne l'historique", async () => {
    Client.findOne.mockResolvedValue({ id: "cl1" });
    ClientTransaction.findAll.mockResolvedValue([{ id: "t1" }]);
    const res = mockRes();
    await clientCtrl.getClientTransactions({ params: { id: "cl1" }, ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "t1" }]);
  });

  it("getClientTransactions retourne 404", async () => {
    Client.findOne.mockResolvedValue(null);
    const res = mockRes();
    await clientCtrl.getClientTransactions({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getClientTransactions gère l'erreur", async () => {
    Client.findOne.mockRejectedValue(boom);
    const res = mockRes();
    await clientCtrl.getClientTransactions({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
