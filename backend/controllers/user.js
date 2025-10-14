const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================
// AUTHENTIFICATION
// ======================

// --- SIGNUP ---
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "✅ Utilisateur créé avec succès",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error("❌ Erreur inscription:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, userInDb.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: userInDb._id },
      process.env.JWT_SECRET || "RANDOM_SECRET_KEY",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      userId: userInDb._id,
      token,
    });
  } catch (err) {
    console.error("❌ Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};