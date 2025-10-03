// models/user.js
const mongoose = require("../db/mongo"); // récupère la connexion

// Schéma utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // doit contenir un @
    unique: true,        // email unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Création du modèle
const User = mongoose.model("User", userSchema);

module.exports = User;
