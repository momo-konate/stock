import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite");

function getAllTables() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      (err, tables) => {
        if (err) reject(err);
        else resolve(tables);
      },
    );
  });
}

function getTableData(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function main() {
  console.log(
    "\n🗄️  ========== CONTENU COMPLET DE LA BASE DE DONNÉES ==========\n",
  );

  try {
    const tables = await getAllTables();

    for (const table of tables) {
      const tableName = table.name;
      const rows = await getTableData(tableName);

      console.log(`📋 TABLE: ${tableName.toUpperCase()}`);
      console.log("─".repeat(60));

      if (rows.length === 0) {
        console.log("⚠️  Aucune donnée\n");
        continue;
      }

      console.log(`📊 ${rows.length} ligne(s)\n`);
      console.table(rows);
      console.log("");
    }

    console.log("=".repeat(60));
    console.log("✅ Affichage terminé\n");
    db.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

main();
