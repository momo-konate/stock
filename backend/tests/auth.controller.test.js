import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRes, boom } from "./helpers.js";

vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn(() => "token"), verify: vi.fn() },
}));

vi.mock("../models/user.model.js", () => ({
  User: {
    findOne: vi.fn(),
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

import { User } from "../models/user.model.js";
import * as authCtrl from "../controllers/auth.controller.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.controller", () => {
  describe("register", () => {
    it("crée un admin quand aucun utilisateur connecté", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: "u1",
        username: "bob",
        email: "b@b.com",
        role: "admin",
      });
      const req = {
        body: {
          username: "bob",
          email: "b@b.com",
          password: "pw",
          securityQuestion: "q",
          securityAnswer: "YES",
        },
      };
      const res = mockRes();
      await authCtrl.register(req, res);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "admin",
          securityAnswer: "yes",
          parentId: null,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("crée un vendeur quand un admin est connecté (securityAnswer absente)", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: "u2", role: "seller" });
      const req = {
        user: { id: "admin1" },
        body: { username: "sam", email: "s@s.com", password: "pw" },
      };
      const res = mockRes();
      await authCtrl.register(req, res);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "seller",
          securityAnswer: null,
          parentId: "admin1",
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("retourne 400 si l'email existe déjà", async () => {
      User.findOne.mockResolvedValue({ id: "exists" });
      const req = { body: { email: "b@b.com" } };
      const res = mockRes();
      await authCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const req = { body: { email: "b@b.com" } };
      const res = mockRes();
      await authCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("login", () => {
    it("retourne un token si les identifiants sont valides", async () => {
      User.findOne.mockResolvedValue({
        id: "u1",
        username: "bob",
        email: "b@b.com",
        role: "admin",
        comparePassword: vi.fn().mockResolvedValue(true),
      });
      const req = { body: { email: "b@b.com", password: "pw" } };
      const res = mockRes();
      await authCtrl.login(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: "token" }),
      );
    });

    it("retourne 401 si le mot de passe est faux", async () => {
      User.findOne.mockResolvedValue({
        comparePassword: vi.fn().mockResolvedValue(false),
      });
      const req = { body: { email: "b@b.com", password: "bad" } };
      const res = mockRes();
      await authCtrl.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("retourne 401 si l'utilisateur n'existe pas", async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { email: "no@no.com", password: "pw" } };
      const res = mockRes();
      await authCtrl.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const req = { body: {} };
      const res = mockRes();
      await authCtrl.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("resetPassword", () => {
    it("réinitialise le mot de passe avec succès", async () => {
      const user = {
        securityAnswer: "hash",
        verifySecurityAnswer: vi.fn().mockResolvedValue(true),
        save: vi.fn().mockResolvedValue({}),
      };
      User.findOne.mockResolvedValue(user);
      const req = {
        body: { email: "b@b.com", securityAnswer: "blue", newPassword: "new" },
      };
      const res = mockRes();
      await authCtrl.resetPassword(req, res);
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) }),
      );
    });

    it("retourne 404 si utilisateur non trouvé", async () => {
      User.findOne.mockResolvedValue(null);
      const res = mockRes();
      await authCtrl.resetPassword({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retourne 400 si pas de question de sécurité", async () => {
      User.findOne.mockResolvedValue({ securityAnswer: null });
      const res = mockRes();
      await authCtrl.resetPassword({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retourne 401 si la réponse est incorrecte", async () => {
      User.findOne.mockResolvedValue({
        securityAnswer: "hash",
        verifySecurityAnswer: vi.fn().mockResolvedValue(false),
      });
      const res = mockRes();
      await authCtrl.resetPassword({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.resetPassword({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getSecurityQuestion", () => {
    it("retourne la question", async () => {
      User.findOne.mockResolvedValue({ securityQuestion: "Couleur ?" });
      const res = mockRes();
      await authCtrl.getSecurityQuestion({ params: { email: "b@b.com" } }, res);
      expect(res.json).toHaveBeenCalledWith({ question: "Couleur ?" });
    });

    it("retourne 404 si non trouvé", async () => {
      User.findOne.mockResolvedValue(null);
      const res = mockRes();
      await authCtrl.getSecurityQuestion({ params: {} }, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retourne 400 si aucune question configurée", async () => {
      User.findOne.mockResolvedValue({ securityQuestion: null });
      const res = mockRes();
      await authCtrl.getSecurityQuestion({ params: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.getSecurityQuestion({ params: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getUsers", () => {
    it("retourne la liste", async () => {
      User.findAll.mockResolvedValue([{ id: "u1" }]);
      const res = mockRes();
      await authCtrl.getUsers({ user: { id: "admin1" } }, res);
      expect(res.json).toHaveBeenCalledWith([{ id: "u1" }]);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findAll.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.getUsers({ user: { id: "admin1" } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteUser", () => {
    it("supprime un utilisateur", async () => {
      const user = { id: "u2", destroy: vi.fn().mockResolvedValue({}) };
      User.findOne.mockResolvedValue(user);
      const res = mockRes();
      await authCtrl.deleteUser(
        { params: { id: "u2" }, user: { id: "admin1" } },
        res,
      );
      expect(user.destroy).toHaveBeenCalled();
    });

    it("retourne 404 si non trouvé", async () => {
      User.findOne.mockResolvedValue(null);
      const res = mockRes();
      await authCtrl.deleteUser({ params: { id: "x" }, user: { id: "a" } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("empêche l'auto-suppression", async () => {
      User.findOne.mockResolvedValue({ id: "admin1" });
      const res = mockRes();
      await authCtrl.deleteUser(
        { params: { id: "admin1" }, user: { id: "admin1" } },
        res,
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.deleteUser({ params: {}, user: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMe", () => {
    it("retourne l'utilisateur courant", async () => {
      User.findByPk.mockResolvedValue({ id: "u1" });
      const res = mockRes();
      await authCtrl.getMe({ user: { id: "u1" } }, res);
      expect(res.json).toHaveBeenCalledWith({ id: "u1" });
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findByPk.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.getMe({ user: { id: "u1" } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateUser", () => {
    it("met à jour avec mot de passe", async () => {
      const user = {
        id: "u2",
        username: "x",
        email: "x@x.com",
        role: "seller",
        createdAt: "date",
        update: vi.fn().mockResolvedValue({}),
      };
      User.findOne.mockResolvedValue(user);
      const res = mockRes();
      await authCtrl.updateUser(
        {
          params: { id: "u2" },
          user: { id: "admin1" },
          body: { username: "x", email: "x@x.com", role: "seller", password: "np" },
        },
        res,
      );
      expect(user.update).toHaveBeenCalledWith(
        expect.objectContaining({ password: "np" }),
      );
    });

    it("met à jour sans mot de passe", async () => {
      const user = { id: "u2", update: vi.fn().mockResolvedValue({}) };
      User.findOne.mockResolvedValue(user);
      const res = mockRes();
      await authCtrl.updateUser(
        { params: { id: "u2" }, user: { id: "a" }, body: { username: "y" } },
        res,
      );
      expect(user.update).toHaveBeenCalledWith(
        expect.not.objectContaining({ password: expect.anything() }),
      );
    });

    it("retourne 404 si non trouvé", async () => {
      User.findOne.mockResolvedValue(null);
      const res = mockRes();
      await authCtrl.updateUser({ params: {}, user: {}, body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retourne 500 en cas d'erreur", async () => {
      User.findOne.mockRejectedValue(boom);
      const res = mockRes();
      await authCtrl.updateUser({ params: {}, user: {}, body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
