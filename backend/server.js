import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import modules and routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import clientRoutes from "./routes/client.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import { setupAssociations } from "./models/associations.js";
import { protect } from "./middleware/auth.middleware.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import { sequelize } from "./models/product.model.js";

// Load environment variables
dotenv.config();

// Verify JWT_SECRET
if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET doit être défini dans le fichier .env');
  process.exit(1);
}

// Initialize associations as soon as models are imported
setupAssociations();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors());

// Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Augmenté pour éviter les erreurs 429
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500, // Augmenté pour la session et la gestion du personnel
  message: "Trop de tentatives, veuillez réessayer plus tard.",
});

app.use("/api/", globalLimiter);
app.use("/api/auth/", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Log requests
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Routes publiques
app.use("/api/auth", authRoutes);

// Routes protégées
app.use("/api/products", protect, productRoutes);
app.use("/api/sales", protect, saleRoutes);
app.use("/api/expenses", protect, expenseRoutes);
app.use("/api/shop", protect, shopRoutes);
app.use("/api/clients", protect, clientRoutes);
app.use("/api/suppliers", protect, supplierRoutes);
app.use("/api/categories", protect, categoryRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ 
    message: "API de Gestion de Stock - StockPro",
    version: "1.0.0",
    status: "running"
  });
});

// Handle 404
app.use(notFound);

// Handle errors
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      logger.success(`Serveur démarré sur le port ${PORT}`);
      logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error("Impossible de démarrer le serveur", err);
    process.exit(1);
  }
};

startServer();
