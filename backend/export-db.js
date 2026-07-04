import sqlite3 from "sqlite3";
import { writeFileSync } from "fs";

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
  console.log("📊 Export de la base de données en JSON...\n");

  try {
    const tables = await getAllTables();
    const result = {};

    for (const table of tables) {
      const tableName = table.name;
      const rows = await getTableData(tableName);
      result[tableName] = rows;
      console.log(`✅ ${tableName.padEnd(25)} ${rows.length} ligne(s)`);
    }

    const filename = "database-export.json";
    writeFileSync(filename, JSON.stringify(result, null, 2), "utf-8");

    console.log(`\n✅ Export réussi: ${filename}`);
    console.log(
      `📝 Vous pouvez ouvrir ce fichier dans VS Code pour consulter les données\n`,
    );

    db.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

main();
