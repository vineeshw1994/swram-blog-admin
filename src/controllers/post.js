const Post = require('../models/Post');

const createPost = async (req, res) => { 
  console.log(req?.user ,'current user')
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const { title, description } = req.body;
  console.log(req.body,'this is req form body')
  const post = await Post.create({ title, description, author: req.user.id });
  res.json(post);
};
 
const getPosts = async (req, res) => {
  const posts = await Post.find().select('title description');
  res.json(posts);
};

const updatePost = async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.sendStatus(404);
  res.json(post);
};

const deletePost = async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

module.exports = { createPost, getPosts, updatePost, deletePost };