const express = require('express')
const app = express()
const cors = require("cors");
const port = 4000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post("/api/auth/signup", signUpUser )
app.post("/api/auth/login", loginUser )

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function signUpUser(req, res){
    const body = req.body;
    console.log("req:", body);
    res.send("Sign up")
}
function loginUser(req, res) {
  const body = req.body;
  console.log("login req:", body);
  res.send({
    userId: "123",
    token: "token"
  });
}