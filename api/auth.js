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
  console.log('jwt for user', payload.id);
  User.findOne({id: payload.id}, (err, user) => {
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
  console.log('getting user', req.user.username, req.user.id);
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(500).json({msg: err.message});
    }

    res.json({username: user.username});
  });
});

router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please provide username and password.'});
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    
    newUser.save(err => {
      if (err) {
        return res.json({success: false, msg: 'User already exists.'});
      }
      res.json({success: true, msg: 'Successfully created new user.'});
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {

    if (!user) {
      res.status(401).json({success: false, msg: 'Authentication failed.'});
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        const u = JSON.parse(JSON.stringify(user)); // Massage user into a plain object, required by jwt.sign
          
        if (isMatch && !err) {
          const token = jwt.sign(u, process.env.JWT_SECRET);
          res.status(200).json({success: true, token: 'JWT ' + token, user: {
            username: u.username
          }});

        } else {
          res.status(401).json({success: false, msg: 'Authentication failed.'});
        }
      });
    }
  });
});

module.exports = router;