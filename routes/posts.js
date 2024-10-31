// Import modules
const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// Middleware - Authentication check
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Route handler

// Get all posts
router.get('/posts', isAuthenticated, async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name');
        res.render('posts', { posts, content: '' }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Create new post - view form
router.get('/posts/new', isAuthenticated, (req, res) => {
    res.render('edit', { post: null, content: '' }); // Pass null for a new post and empty content
});

// Create new post - submission
router.post('/posts', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content, user: req.session.userId });

    try {
        await post.save();
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(400).send("Bad Request");
    }
});

// Edit post - view form
router.get('/posts/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render('edit', { post, content: '' }); // Pass the post to the edit view and empty content
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Edit post - submission
router.post('/posts/edit/:id', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;

    try {
        await Post.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(400).send("Bad Request");
    }
});

// Delete post
router.post('/posts/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
