import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";

// Import réel des modèles : l'import exécute la définition Sequelize
// (aucune connexion à la base n'est ouverte tant qu'on ne fait pas de requête).
import { sequelize, Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { Client } from "../models/client.model.js";
import { ClientTransaction } from "../models/clientTransaction.model.js";
import { Expense } from "../models/expense.model.js";
import { Sale } from "../models/sale.model.js";
import { Shop } from "../models/shop.model.js";
import Supplier from "../models/supplier.model.js";
import { setupAssociations } from "../models/associations.js";

describe("définitions des modèles", () => {
  const cases = [
    [Product, "Product", ["nom", "quantite", "prix", "userId", "categorie"]],
    [User, "User", ["username", "email", "password", "role", "parentId"]],
    [Category, "Category", ["nom", "userId"]],
    [Client, "Client", ["name", "totalDebt", "userId"]],
    [ClientTransaction, "ClientTransaction", ["clientId", "type", "amount"]],
    [Expense, "Expense", ["description", "amount", "userId"]],
    [Sale, "Sale", ["productId", "quantite", "total", "paymentStatus"]],
    [Shop, "Shop", ["name", "userId"]],
    [Supplier, "Supplier", ["name", "ownerId"]],
  ];

  it("utilisent tous la même instance sequelize", () => {
    expect(Product.sequelize).toBe(sequelize);
    expect(User.sequelize).toBe(sequelize);
  });

  it.each(cases)("%o définit ses attributs", (Model, name, attrs) => {
    expect(Model.name).toBe(name);
    for (const attr of attrs) {
      expect(Model.rawAttributes[attr]).toBeDefined();
    }
  });
});

describe("hooks User (hash bcrypt)", () => {
  it("beforeCreate hashe le mot de passe et la réponse de sécurité", async () => {
    const user = { password: "secret", securityAnswer: "Blue" };
    await User.runHooks("beforeCreate", user);
    expect(user.password).not.toBe("secret");
    expect(await bcrypt.compare("secret", user.password)).toBe(true);
    // securityAnswer est hashée en minuscules
    expect(await bcrypt.compare("blue", user.securityAnswer)).toBe(true);
  });

  it("beforeCreate ne fait rien sans password ni securityAnswer", async () => {
    const user = {};
    await User.runHooks("beforeCreate", user);
    expect(user.password).toBeUndefined();
    expect(user.securityAnswer).toBeUndefined();
  });

  it("beforeUpdate re-hashe si les champs ont changé", async () => {
    const user = {
      changed: (field) => field === "password" || field === "securityAnswer",
      password: "newpw",
      securityAnswer: "Green",
    };
    await User.runHooks("beforeUpdate", user);
    expect(await bcrypt.compare("newpw", user.password)).toBe(true);
    expect(await bcrypt.compare("green", user.securityAnswer)).toBe(true);
  });

  it("beforeUpdate ne fait rien si rien n'a changé", async () => {
    const user = { changed: () => false, password: "keep", securityAnswer: "keep" };
    await User.runHooks("beforeUpdate", user);
    expect(user.password).toBe("keep");
    expect(user.securityAnswer).toBe("keep");
  });
});

describe("méthodes d'instance User", () => {
  it("comparePassword valide un bon mot de passe", async () => {
    const hash = await bcrypt.hash("secret", 10);
    const ok = await User.prototype.comparePassword.call({ password: hash }, "secret");
    const ko = await User.prototype.comparePassword.call({ password: hash }, "wrong");
    expect(ok).toBe(true);
    expect(ko).toBe(false);
  });

  it("verifySecurityAnswer compare en minuscules", async () => {
    const hash = await bcrypt.hash("blue", 10);
    const ok = await User.prototype.verifySecurityAnswer.call({ securityAnswer: hash }, "BLUE");
    expect(ok).toBe(true);
  });
});

describe("associations", () => {
  it("setupAssociations configure les relations sans erreur", () => {
    expect(() => setupAssociations()).not.toThrow();
    expect(Sale.associations.product).toBeDefined();
    expect(Client.associations).toHaveProperty("ClientTransactions");
    expect(User.associations).toHaveProperty("members");
  });
});
