const { Router } = require('express');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/post');

const router = Router();

router.post('/post', createPost);
router.get('/posts', getPosts); 
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;