import sqlite3 from "sqlite3";
import { readFileSync } from "fs";

const db = new sqlite3.Database("./database.sqlite");

console.log("\n📊 ============ BASE DE DONNÉES SQLite ============\n");

// Récupérer les tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }

  if (!tables || tables.length === 0) {
    console.log("⚠️  Aucune table trouvée");
    process.exit(0);
  }

  console.log(`✅ Tables trouvées: ${tables.length}\n`);

  let completedTables = 0;

  tables.forEach((table, index) => {
    const tableName = table.name;

    // Info sur la table
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      console.log(`\n📋 TABLE: ${tableName}`);
      console.log("─".repeat(50));

      if (columns) {
        console.log("Colonnes:");
        columns.forEach((col) => {
          const pk = col.pk ? " 🔑" : "";
          const notnull = col.notnull ? " (NOT NULL)" : "";
          console.log(`  • ${col.name}: ${col.type}${pk}${notnull}`);
        });
      }

      // Compter les lignes
      db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, result) => {
        if (result) {
          console.log(`\n📈 ${result.count} ligne(s)\n`);

          if (result.count > 0) {
            // Afficher les données
            db.all(`SELECT * FROM ${tableName} LIMIT 5`, (err, rows) => {
              if (rows && rows.length > 0) {
                console.log("📄 Données (max 5 lignes):");
                console.table(rows);
              }

              completedTables++;
              if (completedTables === tables.length) {
                console.log("\n" + "=".repeat(50));
                console.log("✅ Affichage terminé");
                db.close();
                process.exit(0);
              }
            });
          } else {
            completedTables++;
            if (completedTables === tables.length) {
              console.log("\n" + "=".repeat(50));
              console.log("✅ Affichage terminé");
              db.close();
              process.exit(0);
            }
          }
        }
      });
    });
  });
});
