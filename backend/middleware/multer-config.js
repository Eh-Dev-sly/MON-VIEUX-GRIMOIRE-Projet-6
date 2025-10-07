const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const extension = MIME_TYPES[req.file.mimetype];
  const fileName = req.file.originalname.split(' ').join('_') + Date.now() + '.' + extension;
  const outputPath = path.join('images', fileName);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 207, height: 261 })
      .toFormat('webp')
      .webp({ quality: 80 }) 
      .toFile(outputPath);

    req.file.filename = fileName;
    next();
  } catch (err) {
    console.error("Erreur compression image:", err);
    res.status(500).json({ error: "Erreur compression image" });
  }
};

module.exports = { upload, compressImage };
