const jwt = require("jsonwebtoken");
const JWT_SECRET = "JWT2003SECRETKEY"; // même clé que dans index.js

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
