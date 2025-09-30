const mongoose = require("mongoose");

const user = "eh_sly";
const password = "sm2oF8HNnDlJ82uz";
const DB_URL = `mongodb+srv://${user}:${password}@monvieuxgrimoire.nukhpjv.mongodb.net/?retryWrites=true&w=majority&appName=monVieuxGrimoire`;

// Connexion MongoDB
mongoose.connect(DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Définition du schéma User avec validation regex
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^.*@.*$/, "❌ Email must contain @"], // <-- Regex obligatoire
  },
  password: {
    type: String,
    required: true,
  },
});

// Création du modèle
const User = mongoose.model("User", userSchema);

module.exports = User;
