/**
 * Configuration de la base de données (connexion Sequelize)
 * ---------------------------------------------------------
 * On centralise ICI l'unique instance Sequelize de l'application.
 * Tous les modèles (Product, User, Sale, ...) importent cette même
 * instance : ils partagent donc la même connexion à la base SQLite.
 *
 * SQLite = base de données stockée dans un simple fichier (database.sqlite).
 * Parfait pour un projet scolaire : aucun serveur de base à installer.
 */
import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// En modules ES (type: "module"), __dirname n'existe pas : on le recrée.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"), // fichier de la base
  logging: false, // ne pas afficher chaque requête SQL dans la console
});

export default sequelize;
