require("./db/mongo.js");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const port = 4000;

app.use(cors());
app.use(express.json());

const User = require("./db/mongo.js");

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/auth/signup", signUpUser);
app.post("/api/auth/login", loginUser);

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

// SIGNUP
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

    // Hasher le mot de passe avant de le sauvegarder (10 est un "salt rounds")
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer et sauvegarder le nouvel utilisateur avec mot de passe hashé
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    return res
      .status(201)
      .json({ message: "Utilisateur créé", userId: savedUser._id });
  } catch (err) {
    console.error("Erreur inscription:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// LOGIN
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe
    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Comparer le mot de passe avec le hash en base
    const isPasswordValid = await bcrypt.compare(password, userInDb.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Succès → renvoyer userId (et plus tard le token JWT)
    return res.status(200).json({
      userId: userInDb._id,
      token: "fake-user-token", // ⚠️ provisoire avant JWT
    });
  } catch (err) {
    console.error("Erreur login:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
