const mongoose = require("mongoose");

const user = "eh_sly";
const password = "sm2oF8HNnDlJ82uz";
const DB_URL = `mongodb+srv://${user}:${password}@monvieuxgrimoire.nukhpjv.mongodb.net/?retryWrites=true&w=majority&appName=monVieuxGrimoire`;

// Connexion MongoDB
mongoose.connect(DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Définition du modèle User
const User = mongoose.model("User", {
  email: String,
  password: String,
});

// Export du modèle pour l'utiliser dans index.js
module.exports = User;