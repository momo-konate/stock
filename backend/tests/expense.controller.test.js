import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("../models/expense.model.js", () => ({
  Expense: { findAll: vi.fn(), create: vi.fn(), destroy: vi.fn() },
}));

import { Expense } from "../models/expense.model.js";
import * as expenseCtrl from "../controllers/expense.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("expense.controller", () => {
  it("getExpenses retourne la liste", async () => {
    Expense.findAll.mockResolvedValue([{ id: "e1" }]);
    const res = mockRes();
    await expenseCtrl.getExpenses({ ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: "e1" }]);
  });

  it("getExpenses gère l'erreur", async () => {
    Expense.findAll.mockRejectedValue(boom);
    const res = mockRes();
    await expenseCtrl.getExpenses({ ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createExpense crée", async () => {
    Expense.create.mockResolvedValue({ id: "e1" });
    const res = mockRes();
    await expenseCtrl.createExpense({ body: { description: "Loyer", amount: 100 }, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createExpense gère l'erreur", async () => {
    Expense.create.mockRejectedValue(boom);
    const res = mockRes();
    await expenseCtrl.createExpense({ body: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deleteExpense supprime", async () => {
    Expense.destroy.mockResolvedValue(1);
    const res = mockRes();
    await expenseCtrl.deleteExpense({ params: { id: "e1" }, ownerId: "o1" }, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });

  it("deleteExpense gère l'erreur", async () => {
    Expense.destroy.mockRejectedValue(boom);
    const res = mockRes();
    await expenseCtrl.deleteExpense({ params: {}, ownerId: "o1" }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
