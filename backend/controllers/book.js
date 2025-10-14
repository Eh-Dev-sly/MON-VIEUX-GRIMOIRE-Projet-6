const Book = require("../models/Books");
const fs = require("fs");

// --- GET TOUS LES LIVRES ---
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error("❌ Erreur récupération livres:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- GET UN LIVRE ---
exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    res.status(200).json(book);
  } catch (err) {
    console.error("❌ Erreur récupération livre:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- POST CRÉATION LIVRE ---
exports.createBook = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image manquante" });
    const bookData = JSON.parse(req.body.book);

    const newBook = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      averageRating: 0,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("❌ Erreur création livre:", err);
    res.status(400).json({ error: err.message });
  }
};

// --- PUT MODIFICATION LIVRE ---
exports.modifyBook = async (req, res) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };

    delete bookObject.userId;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ error: "Non autorisé à modifier ce livre" });
    }

    await Book.updateOne({ _id: req.params.id }, { ...bookObject });
    res.status(200).json({ message: "📖 Livre modifié avec succès" });
  } catch (err) {
    console.error("❌ Erreur modification livre:", err);
    res.status(400).json({ error: err.message });
  }
};

// --- DELETE LIVRE ---
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ error: "Non autorisé à supprimer ce livre" });
    }

    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async (err) => {
      if (err) console.error("Erreur suppression image :", err);
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Livre supprimé avec succès !" });
    });
  } catch (err) {
    console.error("❌ Erreur suppression livre:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- AJOUT D'UNE NOTE ---
exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "Note invalide (0 à 5)" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });

    const alreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
    if (alreadyRated) {
      return res.status(400).json({ error: "Vous avez déjà noté ce livre" });
    }

    book.ratings.push({ userId: req.auth.userId, grade: rating });

    const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error("❌ Erreur ajout note :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// --- LES LIVRES LES MIEUX NOTÉS ---
exports.getBestRating = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3); // ✅ 3 meilleurs
    res.status(200).json(books);
  } catch (err) {
    console.error("❌ Erreur récupération meilleurs livres :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
