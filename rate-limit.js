const express = require("express");

const app = express();
app.use(express.json());

const failedAttempts = {};
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutter blokering

app.post("/login", (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"]; // Håndter X-Forwarded-For, hvis den bruges
  const { username, password } = req.body;

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = { count: 0, blockedUntil: null };
  }

  // Tjek om IP'en er blokeret
  if (
    failedAttempts[ip].blockedUntil &&
    Date.now() < failedAttempts[ip].blockedUntil
  ) {
    return res.status(429).json({
      message: "For mange fejlede loginforsøg. Prøv igen senere.",
    });
  }

  // Simpel login-check (skal erstattes med rigtig authentication)
  if (username !== "user" || password !== "password") {
    failedAttempts[ip].count++;

    if (failedAttempts[ip].count >= 3) {
      failedAttempts[ip].blockedUntil = Date.now() + BLOCK_TIME;
      return res.status(429).json({
        message:
          "For mange fejlede loginforsøg. Din IP er blokeret i 15 minutter.",
      });
    }

    return res
      .status(401)
      .json({ message: "Forkert brugernavn eller adgangskode." });
  }

  // Login succes: Nulstil fejltæller
  failedAttempts[ip] = { count: 0, blockedUntil: null };

  res.json({ message: "Login succesfuldt!" });
});

app.listen(3000, () => console.log("Server kører på port 3000"));
