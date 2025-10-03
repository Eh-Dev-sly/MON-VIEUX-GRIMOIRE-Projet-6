// index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("./db/mongo"); // initialise la connexion MongoDB
const User = require("./models/User");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/auth/signup", signUpUser);
app.post("/api/auth/login", loginUser);

app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});

// --- SIGNUP ---
async function signUpUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sauvegarde en base
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error("❌ Erreur inscription:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// --- LOGIN ---
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, userInDb.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    res.status(200).json({
      userId: userInDb._id,
      token: "fake-user-token", // ⚠️ temporaire avant JWT
    });
  } catch (err) {
    console.error("❌ Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
