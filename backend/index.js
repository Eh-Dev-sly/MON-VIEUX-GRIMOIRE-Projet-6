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
  console.log(`Example app listening on port ${port}`);
});

const users = [];

function signUpUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const dbControl = users.find((user) => user.email === email);
  if (dbControl != null) {
    return res.status(400).send("Email is already used");
  }
  const user = {
    email: email,
    password: password,
  };
  users.push(user);
  res.send("Sign up");
}
function loginUser(req, res) {
  const { email, password } = req.body;
  console.log("login req:", req.body);
  console.log("users in memory:", users);

  if (email === adminUser.email && password === adminUser.password) {
    return res.status(200).json({
      userId: "admin",
      token: "fake-admin-token"
    });
  }

  const userInDb = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!userInDb) {
    return res.status(401).json({ error: "Wrong credentials" });
  }

  res.status(200).json({
    userId: userInDb.email,
    token: "fake-user-token"
  });
}

