require("./db/mongo.js");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;

app.use(cors());
app.use(express.json());

const adminUser = {
  email: "eh.dev.sioly@gmail.com",
  password: "123456",
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/auth/signup", signUpUser);
app.post("/api/auth/login", loginUser);

app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});

const User = require("./db/mongo.js");

function signUpUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).send("Email is already used");
    }

    const newUser = new User({ email, password });
    newUser
      .save()
      .then(() => res.send("✅ User signed up"))
      .catch((err) => {
        console.error("❌ Signup error:", err);
        res.status(500).send("Erreur serveur");
      });
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  // Cas admin en dur
  if (email === adminUser.email && password === adminUser.password) {
    return res.status(200).json({
      userId: "admin",
      token: "fake-admin-token",
    });
  }

  // Recherche dans MongoDB
  User.findOne({ email, password })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Erreur de mot de passe" });
      }

      res.status(200).json({
        userId: user.email,
        token: "fake-user-token",
      });
    })
    .catch((err) => {
      console.error("❌ Login error:", err);
      res.status(500).json({ error: "Erreur serveur" });
    });
}
