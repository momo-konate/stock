import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import clientRoutes from "./routes/client.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";

import { protect } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet()); // Protection des headers HTTP
app.use(cors());

// Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limite chaque IP à 1000 requêtes par fenêtre
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 30, // 20 tentatives max par heure (login/register/reset)
  message:
    "Trop de tentatives de connexion, veuillez réessayer dans une heure.",
});

app.use("/api/", globalLimiter);
app.use("/api/auth/", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes publiques
app.use("/api/auth", authRoutes);

// Routes protégées
app.use("/api/products", protect, productRoutes);
app.use("/api/sales", protect, saleRoutes);
app.use("/api/expenses", protect, expenseRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", supplierRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API de Gestion de Stock en cours d'exécution...");
});

// Lancement du serveur
// Lancement du serveur et synchronisation DB
import { sequelize } from "./models/product.model.js";

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de synchronisation DB:", err);
  });
