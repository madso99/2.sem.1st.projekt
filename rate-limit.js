const express = require("express");

const app = express();

app.use(express.json());

const failedAttempts = {};
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 5 * 60 * 1000; // 5 minutter i millisekunder

// Middleware til logging af requests
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${ip}`
  );
  next();
});

// Simpel health check route
app.get("/", (req, res) => res.send("Serveren kører!"));

// Rate-limiting login route
app.get("/login", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const { username, password } = req.query;

  failedAttempts[ip] = failedAttempts[ip] || { count: 0, blockedUntil: null };

  // Hvis IP'en er blokeret
  if (
    failedAttempts[ip].blockedUntil &&
    Date.now() < failedAttempts[ip].blockedUntil
  ) {
    const remainingTime = Math.ceil(
      (failedAttempts[ip].blockedUntil - Date.now()) / 1000
    );
    return res.status(429).json({
      message: `Blokeret. Prøv igen om ${remainingTime} sekunder.`,
    });
  }

  // Hvis login er korrekt
  if (username === "user" && password === "password") {
    console.log(`✅ Login succesfuldt for IP: ${ip}`);
    failedAttempts[ip] = { count: 0, blockedUntil: null };
    return res.json({ message: "Login succesfuldt!" });
  }

  // Hvis login er forkert
  failedAttempts[ip].count++;
  const remainingAttempts = MAX_ATTEMPTS - failedAttempts[ip].count;
  console.log(
    `❌ Forkert login for IP: ${ip}. Forsøg tilbage: ${remainingAttempts}`
  );

  if (failedAttempts[ip].count >= MAX_ATTEMPTS) {
    failedAttempts[ip].blockedUntil = Date.now() + BLOCK_TIME;
    console.log(`🚨 IP ${ip} blokeret i 5 minutter.`);
    return res.status(429).json({
      message: "For mange fejlede forsøg. Din IP er blokeret.",
      remainingTime: BLOCK_TIME / 1000,
    });
  }

  return res
    .status(401)
    .json({ message: `Forkert login. ${remainingAttempts} forsøg tilbage.` });
});

// Catch-all til ukendte routes
app.use((req, res) => res.status(404).json({ message: "Route ikke fundet" }));

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server kører på port ${PORT}`));
