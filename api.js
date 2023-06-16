const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
    console.log("Database connected.");
   })
   .catch((err) => {
    console.error(err);
   })

const db = mongoose.connection;

// Define word schema
const wordSchema = new mongoose.Schema({
  word: String
});

// Define word model
const Word = mongoose.model('Word', wordSchema);

// Create Express app
const app = express();
app.use(express.json());

// API endpoint: GET /api/search?w=word
app.get('/api/search', async (req, res) => {
  const word = req.query.w;

  try {
    const result = await Word.findOne({word : `$word`}).exec;
    if (result) {
      return res.json({ message: 'Word found in the dictionary.' });
    } else {
      return res.status(404).json({ error: 'Word not found in the dictionary.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while searching for the word.' });
  }
});

// API endpoint: POST /api/normalize
app.post('/api/normalize', (req, res) => {
  const word = req.body.word;
  if (!word) {
    return res.status(400).json({ error: 'Word is required.' });
  }
  const normalizedWord = word.toLowerCase().replace(/[^a-z]/g, '');
  return res.json({ normalizedWord });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

