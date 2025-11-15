require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  picture: String,
});

const Post = mongoose.model('Post', postSchema);
// --- End MongoDB Connection ---

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use('/uploads', express.static(uploadsDir));
app.use(express.json()); // for parsing application/json

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all posts
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Get a single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).send('Error finding post');
  }
});

// Create a new post
app.post('/api/posts', upload.single('picture'), async (req, res) => {
  const { title, content } = req.body;
  const picture = req.file ? `/uploads/${req.file.filename}` : null;
  const newPost = new Post({ title, content, picture });
  await newPost.save();
  res.status(201).json(newPost);
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).send('Error updating post');
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.status(204).send();
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting post');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});