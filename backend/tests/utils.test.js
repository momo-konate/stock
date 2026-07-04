import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { clientSchema } from "../schemas/client.schema.js";
import { productSchema } from "../schemas/product.schema.js";
import { saleSchema } from "../schemas/sale.schema.js";
import { supplierSchema } from "../schemas/supplier.schema.js";

import { validate } from "../middleware/validation.js";
import { errorHandler, notFound } from "../middleware/errorHandler.js";
// L'import couvre la construction des rate limiters
import { globalLimiter, authLimiter } from "../middleware/security.js";

const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

// =====================================================================
// SCHEMAS JOI
// =====================================================================
describe("schemas Joi", () => {
  it("registerSchema valide/invalide", () => {
    expect(
      registerSchema.validate({ username: "bob", email: "b@b.com", password: "secret" }).error,
    ).toBeUndefined();
    expect(registerSchema.validate({ email: "invalide", password: "x" }).error).toBeDefined();
  });

  it("loginSchema valide/invalide", () => {
    expect(loginSchema.validate({ email: "b@b.com", password: "x" }).error).toBeUndefined();
    expect(loginSchema.validate({}).error).toBeDefined();
  });

  it("clientSchema valide/invalide", () => {
    expect(clientSchema.validate({ name: "Ali", phone: "770000000" }).error).toBeUndefined();
    expect(clientSchema.validate({ name: "A", phone: "abc" }).error).toBeDefined();
  });

  it("productSchema valide/invalide", () => {
    expect(
      productSchema.validate({ nom: "Riz", prix: 100, quantite: 5, categorie: "Bio" }).error,
    ).toBeUndefined();
    expect(productSchema.validate({ nom: "R", prix: -1, quantite: -2 }).error).toBeDefined();
  });

  it("saleSchema valide/invalide", () => {
    expect(saleSchema.validate({ productId: "p1", quantite: 2 }).error).toBeUndefined();
    expect(saleSchema.validate({ productId: "p1", quantite: 0 }).error).toBeDefined();
  });

  it("supplierSchema valide/invalide", () => {
    expect(supplierSchema.validate({ name: "Fourn", email: "f@f.com" }).error).toBeUndefined();
    expect(supplierSchema.validate({ name: "F", email: "bad" }).error).toBeDefined();
  });
});

// =====================================================================
// VALIDATION MIDDLEWARE
// =====================================================================
describe("validate middleware", () => {
  it("appelle next() si la validation réussit", () => {
    const schema = { validate: () => ({ error: null }) };
    const next = vi.fn();
    const res = mockRes();
    validate(schema)({ body: {} }, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("retourne 400 avec les messages agrégés si échec", () => {
    const schema = {
      validate: () => ({
        error: { details: [{ message: '"nom" est requis' }, { message: '"prix" invalide' }] },
      }),
    };
    const next = vi.fn();
    const res = mockRes();
    validate(schema)({ body: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "nom est requis, prix invalide" });
    expect(next).not.toHaveBeenCalled();
  });
});

// =====================================================================
// ERROR HANDLER MIDDLEWARE
// =====================================================================
describe("errorHandler middleware", () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("utilise le statusCode fourni et inclut la stack en développement", () => {
    process.env.NODE_ENV = "development";
    const err = new Error("Boom");
    err.statusCode = 422;
    err.details = { field: "x" };
    const res = mockRes();
    errorHandler(err, {}, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Boom", stack: expect.any(String) }),
    );
  });

  it("utilise 500 par défaut en production sans stack", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("");
    err.message = "";
    const res = mockRes();
    errorHandler(err, {}, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    const payload = res.json.mock.calls[0][0];
    expect(payload).not.toHaveProperty("stack");
    expect(payload.message).toBe("Erreur serveur interne");
  });

  it("notFound crée une erreur 404 et appelle next", () => {
    const next = vi.fn();
    notFound({ originalUrl: "/inconnu" }, mockRes(), next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
  });
});

// =====================================================================
// SECURITY MIDDLEWARE (import = couverture)
// =====================================================================
describe("security middleware", () => {
  it("expose des limiters", () => {
    expect(typeof globalLimiter).toBe("function");
    expect(typeof authLimiter).toBe("function");
  });
});
