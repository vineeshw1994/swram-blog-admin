const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());

// // req.user is attached by gateway
// app.use((req, res, next) => {
//   next();
// });

app.use((req, res, next) => {
  // Reconstruct req.user from headers
  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'] || 'user'
    };
  }
  next();
});
app.use('/', postRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doc-swram-posts';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Post DB connected'))
  .catch(err => console.error(err));

const PORT = 4002;
app.listen(PORT, () => console.log(`Post Service @ :${PORT}`));