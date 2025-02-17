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

// 🔹 Test GET route (for at sikre, at serveren svarer korrekt)
app.get("/", (req, res) => {
  res.send("Serveren svarer!");
});

// 🔹 GET /login - Forklarer, at kun POST er tilladt
app.get("/login", (req, res) => {
  res.status(405).json({ message: "Brug POST /login i stedet for GET." });
});

// 🔹 In-memory rate-limiting (blokering efter 3 forsøg)
const failedAttempts = {};
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutter

// 🔹 POST /login - Håndterer login og rate-limiting
app.post("/login", (req, res) => {
  console.log("Modtaget POST /login request");

  const ip = req.ip || req.headers["x-forwarded-for"];
  const { username, password } = req.body;

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = { count: 0, blockedUntil: null };
  }

  // Hvis IP'en er blokeret
  if (
    failedAttempts[ip].blockedUntil &&
    Date.now() < failedAttempts[ip].blockedUntil
  ) {
    return res
      .status(429)
      .json({ message: "For mange fejlede loginforsøg. Prøv igen senere." });
  }

  // Simpel login-check (du kan ændre dette til en database senere)
  if (username !== "user" || password !== "password") {
    failedAttempts[ip].count++;

    if (failedAttempts[ip].count >= 3) {
      failedAttempts[ip].blockedUntil = Date.now() + BLOCK_TIME;
      return res
        .status(429)
        .json({
          message:
            "For mange fejlede loginforsøg. Din IP er blokeret i 15 minutter.",
        });
    }
    return res
      .status(401)
      .json({ message: "Forkert brugernavn eller adgangskode." });
  }

  // Hvis login lykkes, nulstil fejltæller
  failedAttempts[ip] = { count: 0, blockedUntil: null };
  res.json({ message: "Login succesfuldt!" });
});

// 🔹 Fejlhåndtering for ukendte routes (skal være SIDST!)
app.use((req, res) => {
  console.log(`Ukendt route: ${req.method} ${req.url}`);
  res.status(404).send("Route ikke fundet");
});

// 🔹 Start serveren
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server kører på port ${PORT}`));
