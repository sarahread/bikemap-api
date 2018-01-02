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

const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

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
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msgu: 'Authentication failed.'});
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        const u = JSON.parse(JSON.stringify(user)); // Massage user into a plain object, required by jwt.sign
          
        if (isMatch && !err) {
          const token = jwt.sign(), process.env.JWT_SECRET);

          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed.'});
        }
      });
    }
  });
});

module.exports = router;