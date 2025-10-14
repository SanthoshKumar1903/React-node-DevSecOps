const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'bookmarks.json');

app.use(cors());
app.use(express.json());

// Create empty file if doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// READ: Get all bookmarks
app.get('/api/bookmarks', (req, res) => {
  const bookmarks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(bookmarks);
});

// CREATE: Add new bookmark
app.post('/api/bookmarks', (req, res) => {
  const { name, url } = req.body;
  
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL required' });
  }

  const bookmarks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  
  const newBookmark = {
    id: uuidv4(),
    name: name.trim(),
    url: url.trim(),
    createdAt: new Date().toISOString()
  };

  bookmarks.push(newBookmark);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2));
  
  res.status(201).json(newBookmark);
});

// DELETE: Remove bookmark
app.delete('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  
  const bookmarks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const filtered = bookmarks.filter(b => b.id !== id);
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  
  res.json({ message: 'Deleted' });
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on ${PORT}`);
});