const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Log alle requests for debugging
app.use((req, res, next) => {
  console.log(`Request modtaget: ${req.method} ${req.url} fra IP ${req.ip}`);
  next();
});

// 🔹 Test GET route for at sikre, at serveren svarer
app.get("/", (req, res) => {
  res.send("Serveren svarer!");
});

// 🔹 In-memory rate-limiting
const failedAttempts = {};
const MAX_ATTEMPTS = 3; // Antal forsøg før blokering
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutter i millisekunder

// 🔹 GET /login - Modtager login-oplysninger via query parameters
app.get("/login", (req, res) => {
  console.log("Modtaget GET /login request");

  const ip = req.ip || req.headers["x-forwarded-for"];
  const { username, password } = req.query;

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = { count: 0, blockedUntil: null };
  }

  // ✅ Først tjekker vi, om loginoplysningerne er korrekte
  if (username === "user" && password === "password") {
    console.log(`✅ Login succesfuldt fra IP ${ip}`);
    failedAttempts[ip] = { count: 0, blockedUntil: null };
    return res.json({ message: "Login succesfuldt!" });
  }

  // ❌ Hvis login er forkert, tjek om IP'en er blokeret
  if (
    failedAttempts[ip].blockedUntil &&
    Date.now() < failedAttempts[ip].blockedUntil
  ) {
    const remainingTime = Math.ceil(
      (failedAttempts[ip].blockedUntil - Date.now()) / 1000
    );
    return res
      .status(429)
      .json({
        message: `For mange fejlede loginforsøg. Prøv igen om ${remainingTime} sekunder.`,
      });
  }

  // ❌ Hvis login er forkert, opdater fejltælleren
  failedAttempts[ip].count++;

  // Beregn tilbageværende forsøg
  const remainingAttempts = MAX_ATTEMPTS - failedAttempts[ip].count;
  console.log(
    `❌ Forkert login fra IP ${ip}. Forsøg tilbage: ${remainingAttempts}`
  );

  if (failedAttempts[ip].count >= MAX_ATTEMPTS) {
    failedAttempts[ip].blockedUntil = Date.now() + BLOCK_TIME;
    console.log(`🚨 IP ${ip} er nu blokeret i 15 minutter.`);
    return res
      .status(429)
      .json({
        message:
          "For mange fejlede loginforsøg. Din IP er blokeret i 15 minutter.",
      });
  }

  return res
    .status(401)
    .json({
      message: `Forkert brugernavn eller adgangskode. ${remainingAttempts} forsøg tilbage.`,
    });
});

// 🔹 Fejlhåndtering for ukendte routes
app.use((req, res) => {
  console.log(`Ukendt route: ${req.method} ${req.url}`);
  res.status(404).send("Route ikke fundet");
});

// 🔹 Start serveren
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server kører på port ${PORT}`));
