const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // L'utilisateur qui a ajouté le livre
  title: { type: String, required: true },        // Titre du livre
  author: { type: String, required: true },       // Auteur du livre
  imageUrl: { type: String, required: true },     // URL de l'image du livre
  year: { type: Number, required: true },         // Année de publication
  genre: { type: String, required: true },        // Genre du livre
  ratings: [                                      // Tableau des notes des utilisateurs
    {
      userId: { type: String, required: true },  // ID de l'utilisateur qui a noté
      grade: { type: Number, required: true },   // Note donnée
    },
  ],
  averageRating: { type: Number, default: 0 },   // Moyenne des notes
});

// Création du modèle
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
