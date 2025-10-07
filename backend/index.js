// ======================
// IMPORTS & CONFIG
// ======================
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config(); // pour stocker la clé JWT dans .env

require("./db/mongo"); // initialise la connexion MongoDB
const User = require("./models/User");
const Book = require("./models/Books");
const multer = require("./middleware/multer-config");
const auth = require("./middleware/auth");
const path = require("path");

// ======================
// INITIALISATION
// ======================
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images"))); // pour servir les images

// ======================
// 🌍 ROUTE DE TEST
// ======================
app.get("/", (req, res) => {
  res.send("📚 API Mon Vieux Grimoire en ligne !");
});

// ======================
// AUTHENTIFICATION
// ======================

// --- SIGNUP ---
app.post("/api/auth/signup", async (req, res) => {
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
});

// --- LOGIN ---
app.post("/api/auth/login", async (req, res) => {
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

    // ✅ Génération du token JWT
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
});

// ======================
// ROUTES DES LIVRES
// ======================

// --- GET TOUS LES LIVRES ---
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error("❌ Erreur récupération livres:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- POST AJOUT D’UN LIVRE ---
app.post("/api/books", auth, multer, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image manquante" });

    // Le frontend envoie les données dans req.body.book sous forme de string JSON
    const bookData = JSON.parse(req.body.book);

    const newBook = new Book({
      ...bookData,
      userId: req.auth.userId, // ✅ on prend le userId depuis le token
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      averageRating: 0,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("❌ Erreur création livre:", err);
    res.status(400).json({ error: err.message });
  }
});

// --- PUT MODIFICATION D’UN LIVRE ---
app.put("/api/books/:id", auth, multer, async (req, res) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };

    delete bookObject.userId;

    const book = await Book.findOne({ _id: req.params.id });

    if (!book) return res.status(404).json({ error: "Livre introuvable" });

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: "Non autorisé à modifier ce livre" });
    }

    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
    res.status(200).json({ message: "📖 Livre modifié avec succès" });
  } catch (err) {
    console.error("❌ Erreur modification livre:", err);
    res.status(400).json({ error: err.message });
  }
});

// --- DELETE SUPPRESSION D’UN LIVRE ---
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: "Livre introuvable" });
    }

    // 🧠 Vérifier que l'utilisateur est bien le propriétaire
    // (pour l'instant sans middleware auth complet)
    const userIdFromHeader = req.headers["user-id"]; // temporaire, simplifié
    if (book.userId !== userIdFromHeader) {
      return res.status(401).json({ error: "Non autorisé à supprimer ce livre" });
    }

    // 🖼️ Supprimer l'image associée
    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async (err) => {
      if (err) {
        console.error("Erreur suppression image :", err);
      }

      await Book.deleteOne({ _id: id });
      res.status(200).json({ message: "Livre supprimé avec succès !" });
    });
  } catch (err) {
    console.error("❌ Erreur suppression livre:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ======================
// 🚀 LANCEMENT DU SERVEUR
// ======================
app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${port}`);
});
