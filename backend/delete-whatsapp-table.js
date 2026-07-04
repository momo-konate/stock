import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite");

console.log("🗑️  Suppression de la table WhatsAppSessions...\n");

db.run("DROP TABLE IF EXISTS WhatsAppSessions", (err) => {
  if (err) {
    console.error("❌ Erreur:", err.message);
    process.exit(1);
  }

  console.log("✅ Table WhatsAppSessions supprimée avec succès\n");

  // Vérifier les tables restantes
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
    (err, tables) => {
      console.log("📊 Tables restantes:\n");
      tables.forEach((t) => console.log(`   ✅ ${t.name}`));
      console.log("");

      db.close();
      process.exit(0);
    },
  );
});
