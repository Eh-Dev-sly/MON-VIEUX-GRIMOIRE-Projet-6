const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Routes CRUD + notes
router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer.upload, multer.compressImage, bookCtrl.createBook);
router.put("/:id", auth, multer.upload, multer.compressImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
