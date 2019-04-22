const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport'),
      User      = require('../models/user');

// Root Route    
router.get("/", (req, res) => {
    res.render("landing");
});

// =================
//      AUTH ROUTES
// =================

// SHOW Register Route Form
router.get('/register', (req, res) => {
    res.render('register');
});

// NEW Register Logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message)
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/courses');
        });
    });
});

// SHOW Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

// NEW Login Logic
// app.post('/login', middleware, callback);
router.post('/login', passport.authenticate("local",
    {
      successRedirect: '/courses',
      failureRedirect: '/login'
    }), (req, res) => {
});

// LOGOUT Logic
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out')
    res.redirect('/login');
});


module.exports = router;