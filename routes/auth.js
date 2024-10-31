//import modules
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');

//initialize router
const router = express.Router();

//sign up route

router.get('/signup', (req, res) => {
    res.render('signup');
})


router.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({ firstname, lastname, email, password: hashedpassword });

    try {
        user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error signing up');
    }
});

//login route

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user && await bcrypt.compare(password, user.password)){
        req.session.userId = user._id;
        res.redirect('/posts')
    } else {
        res.status(401).send('Inavalid email or password');
    }
});

//logout route
router.get('/logout', (req, res) => {
    res.session.userId = null;
    res.redirect('/login');
})

module.exports = router;