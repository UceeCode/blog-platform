const express = require('express');
const Post = require('../models/Post');
const { post } = require('./auth');

const router = new express.Router();

//middleware - authentication check
const isAuthenticated = (req, res, next) => {
    if(req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

//route handler

//get all posts
router.get('/posts', isAuthenticated, async (req, res) => {
    const posts = await Post.find().populate('user', 'name');
    res.render('posts', { posts });
})

//create new post - view form
router.get('/posts/new', isAuthenticated, (req, res) => {
    res.render('edit', { post: null });
})

//create new post - submission
router.post('/posts', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content, user: req.session.userId });
    await post.save();
    res.redirect('/posts');
});

//edit post - view form
router.get('/posts/edit/:id', isAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post });
});

//edit post - submission
router.post('/post/edit/:id', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params,id, { title, content });
    res.redirect('/posts');
});

//delete post 
router.post('/posts/delete/:id', isAuthenticated, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
});

module.exports = router;