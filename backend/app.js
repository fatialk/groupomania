const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://fatik:groupomania@cluster0.pv03e.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const postsRoutes = require('./routes/posts');
  const userRoutes = require('./routes/user');
  const commentsRoutes = require('./routes/comments');
  const path = require('path');


  app.use('/api/comments', commentsRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));





module.exports = app;