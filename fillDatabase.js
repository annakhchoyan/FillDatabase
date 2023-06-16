const fs = require('fs');
const readline = require('readline');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define word schema
const wordSchema = new mongoose.Schema({
  word: String
});

// Define word model
const Word = mongoose.model('Word', wordSchema);

// Read words_alpha.txt file and fill the database
const rl = readline.createInterface({
  input: fs.createReadStream('words_alpha.txt'),
  output: process.stdout,
  terminal: false
});

rl.on('line', (word) => {
  const newWord = new Word({ word });
  newWord.save((err) => {
    if (err) {
      console.error(err);
    }
  });
});

rl.on('close', () => {
  console.log('Database filled successfully!');
  process.exit(0);
});
