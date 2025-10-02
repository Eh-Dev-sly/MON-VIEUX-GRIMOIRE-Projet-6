require("./db/mongo.js");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;

app.use(cors());
app.use(express.json());

const User = require("./db/mongo.js");

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/auth/signup", signUpUser);
app.post("/api/auth/login", loginUser);

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

// SIGNUP
function signUpUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const newUser = new User({ email, password });
    newUser
      .save()
      .then((savedUser) =>
        res.status(201).json({ message: "Utilisateur créé", userId: savedUser._id })
      )
      .catch((err) => res.status(500).json({ error: "Erreur serveur" }));
  });
}

// LOGIN
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    res.status(200).json({
      userId: user._id.toString(),
      token: "fake-token-" + user._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
