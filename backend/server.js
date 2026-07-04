import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Configuration
import { CONFIG } from "./config/constants.js";
dotenv.config();

// Validate required environment variables
if (!CONFIG.JWT_SECRET || CONFIG.JWT_SECRET === "secret_key") {
  console.error("⚠️  JWT_SECRET doit être défini dans le fichier .env");
  process.exit(1);
}

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import clientRoutes from "./routes/client.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import categoryRoutes from "./routes/category.routes.js";

// Models & Middleware
import { setupAssociations } from "./models/associations.js";
import { protect } from "./middleware/auth.middleware.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { globalLimiter, authLimiter } from "./middleware/security.js";
import { logger } from "./utils/logger.js";
import { sequelize } from "./config/database.js";

// Initialize models
setupAssociations();

// Create app
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
app.use("/api/", globalLimiter);
app.use("/api/auth/", authLimiter);

// Body parser
app.use(express.json({ limit: CONFIG.MAX_FILE_SIZE }));
app.use(express.urlencoded({ limit: CONFIG.MAX_FILE_SIZE, extended: true }));

// Request logging
app.use((req, res, next) => {
  if (CONFIG.NODE_ENV === "development") {
    logger.info(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "API de Gestion de Stock - StockPro",
    version: "1.0.0",
    status: "running",
  });
});

// Routes - Public
app.use("/api/auth", authRoutes);

// Routes - Protected
app.use("/api/products", protect, productRoutes);
app.use("/api/sales", protect, saleRoutes);
app.use("/api/expenses", protect, expenseRoutes);
app.use("/api/shop", protect, shopRoutes);
app.use("/api/clients", protect, clientRoutes);
app.use("/api/suppliers", protect, supplierRoutes);
app.use("/api/categories", protect, categoryRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(CONFIG.PORT, () => {
      logger.success(`✅ Serveur démarré sur le port ${CONFIG.PORT}`);
      logger.info(`📝 Environnement: ${CONFIG.NODE_ENV}`);
    });
  } catch (err) {
    logger.error("❌ Impossible de démarrer le serveur", err);
    process.exit(1);
  }
};

startServer();
