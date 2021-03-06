const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/user', passport.authenticate('jwt'), (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(401).json({msg: 'Failed to retrieve user'});
    }

    res.json({username: user.username});
  });
});

router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({msg: 'Please provide username and password.'});
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    
    newUser.save(err => {
      if (err) {
        return res.status(400).json({msg: 'User already exists.'});
      }
      res.json({msg: 'Successfully created new user.'});
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user) {
      res.status(401).json({msg: 'Authentication failed.'});
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        const u = JSON.parse(JSON.stringify(user)); // Massage user into a plain object, required by jwt.sign
          
        if (isMatch && !err) {
          const token = jwt.sign(u, process.env.JWT_SECRET);
          res.json({token: 'JWT ' + token, user: {
            username: u.username
          }});

        } else {
          res.status(401).json({msg: 'Authentication failed.'});
        }
      });
    }
  });
});

module.exports = router;