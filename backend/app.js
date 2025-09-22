const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff.js')

mongoose.connect(
  'mongodb+srv://users:monVieuxGrimoire@monvieuxgrimoire.pj9n8li.mongodb.net/?retryWrites=true&w=majority&appName=monVieuxGrimoire',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/stuff', stuffRoutes);

module.exports = app;