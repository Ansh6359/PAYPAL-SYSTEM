var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var User = require('../models/User');

// REGISTER GET ROUTE
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// REGISTER POST ROUTE
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.render('register', { title: 'Register', error: 'Username, email, and password are required!' });
  }

  // Check if user already exists
  User.findOne({ email }).then(user => {
    if (user) {
      return res.render('register', { title: 'Register', error: 'User with this email already exists!' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.render('register', { title: 'Register', error: 'Error hashing password!' });

      // Create new user with email and hashed password
      User.create({ username, email, password: hashedPassword })
        .then(() => {
          res.redirect('/users/login'); 
        })
        .catch(err => {
          return res.render('register', { title: 'Register', error: 'Error creating user!' });
        });
    });
  }).catch(err => {
    console.log(err);
    return res.render('register', { title: 'Register', error: 'Something went wrong!' });
  });
});

// LOGIN GET ROUTE
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// LOGIN POST ROUTE
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid username or password'
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/'); 
    });
  })(req, res, next);
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/users/login'); 
  });
});

module.exports = router;
