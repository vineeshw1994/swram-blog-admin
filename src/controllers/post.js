// src/controllers/posts.js
const Post = require('../models/Post');

const createPost = async (req, res) => {
  console.log('Current user:', req.user);
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ msg: 'Title and description required' });
  }

  try {
    const post = await Post.create({
      title,
      description,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Create failed' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title', 'description', 'author', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch posts' });
  }
};

const updatePost = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });

  const { title, description } = req.body;
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    await post.update({ title, description });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Update failed' });
  }
};

const deletePost = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });

  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    await post.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };