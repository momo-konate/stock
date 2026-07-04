/**
 * Configuration centralisée de l'application
 */

import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "stock_pro",

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: "30d",

  // Rate Limiting
  RATE_LIMIT: {
    GLOBAL: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 2000,
    },
    AUTH: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 500,
    },
  },

  // Upload
  MAX_FILE_SIZE: "10mb",

  // Response messages
  MESSAGES: {
    SERVER_ERROR: "Erreur serveur interne",
    UNAUTHORIZED: "Non autorisé",
    FORBIDDEN: "Accès refusé",
    NOT_FOUND: "Ressource non trouvée",
    RATE_LIMIT: "Trop de requêtes, veuillez réessayer plus tard.",
  },
};

export default CONFIG;
