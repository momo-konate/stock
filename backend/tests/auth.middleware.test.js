import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes } from "./helpers.js";

vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn(() => "token"), verify: vi.fn() },
}));

vi.mock("../models/user.model.js", () => ({
  User: { findByPk: vi.fn() },
}));

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { protect, admin } from "../middleware/auth.middleware.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.middleware", () => {
  describe("protect", () => {
    it("définit ownerId depuis parentId", async () => {
      jwt.verify.mockReturnValue({ id: "u1" });
      User.findByPk.mockResolvedValue({ id: "u1", parentId: "shop1" });
      const req = { headers: { authorization: "Bearer tok" } };
      const res = mockRes();
      const next = vi.fn();
      await protect(req, res, next);
      expect(req.ownerId).toBe("shop1");
      expect(next).toHaveBeenCalled();
    });

    it("définit ownerId depuis l'id si pas de parent", async () => {
      jwt.verify.mockReturnValue({ id: "u1" });
      User.findByPk.mockResolvedValue({ id: "u1", parentId: null });
      const req = { headers: { authorization: "Bearer tok" } };
      const res = mockRes();
      const next = vi.fn();
      await protect(req, res, next);
      expect(req.ownerId).toBe("u1");
    });

    it("retourne 401 si utilisateur non trouvé", async () => {
      jwt.verify.mockReturnValue({ id: "u1" });
      User.findByPk.mockResolvedValue(null);
      const req = { headers: { authorization: "Bearer tok" } };
      const res = mockRes();
      const next = vi.fn();
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("retourne 401 si le token est invalide", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("bad token");
      });
      const req = { headers: { authorization: "Bearer bad" } };
      const res = mockRes();
      const next = vi.fn();
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("retourne 401 si aucun token", async () => {
      const req = { headers: {} };
      const res = mockRes();
      const next = vi.fn();
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé, pas de token" });
    });
  });

  describe("admin", () => {
    it("laisse passer un admin", () => {
      const next = vi.fn();
      const res = mockRes();
      admin({ user: { role: "admin" } }, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("refuse un non-admin", () => {
      const next = vi.fn();
      const res = mockRes();
      admin({ user: { role: "seller" } }, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
