import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite");

console.log("\n📊 ============ RÉSUMÉ DE LA BASE DE DONNÉES ============\n");

db.all(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  (err, tables) => {
    if (err) {
      console.error("❌ Erreur:", err);
      process.exit(1);
    }

    if (!tables || tables.length === 0) {
      console.log("⚠️  Aucune table trouvée");
      process.exit(0);
    }

    console.log(`📈 ${tables.length} table(s) trouvée(s):\n`);

    let completed = 0;

    tables.forEach((table) => {
      const tableName = table.name;

      db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, result) => {
        const count = result?.count || 0;
        const icon = count > 0 ? "✅" : "⚠️ ";
        console.log(`${icon} ${tableName.padEnd(25)} ${count} ligne(s)`);

        completed++;
        if (completed === tables.length) {
          console.log("\n" + "=".repeat(55) + "\n");
          db.close();
          process.exit(0);
        }
      });
    });
  },
);
