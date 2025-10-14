// ======================
// IMPORTS & CONFIG
// ======================
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // pour stocker la clé JWT dans .env

// Connexion MongoDB
require("./db/mongo");

// Import des routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// ======================
// INITIALISATION
// ======================
const app = express();
const port = process.env.PORT || 4000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Servir les images statiques
app.use("/images", express.static(path.join(__dirname, "images")));

// ======================
// ROUTES
// ======================
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// ======================
// LANCEMENT DU SERVEUR
// ======================
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
