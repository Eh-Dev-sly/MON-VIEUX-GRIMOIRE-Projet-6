// models/user.js
const mongoose = require("../db/mongo");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "L'adresse email est requise"],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      "Veuillez fournir une adresse email valide (exemple: utilisateur@mail.com)"
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;