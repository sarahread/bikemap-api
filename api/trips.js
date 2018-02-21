const express = require('express');
const passport = require('passport');
const router = express.Router();
const Trip = require('../models/trip');

router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const newTrip = new Trip({
    start: req.body.start,
    end: req.body.end,
    progress: [],
    totalDistance: req.body.totalDistance,
    path: req.body.path,
    user: req.user
  });

  newTrip.save((err, trip) => {
    if (err) {
      return res.status(500).json({ success: false, msg: 'There was a problem creating a trip.' });
    }

    res.json({ success: true, trip });
  });
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
});

module.exports = router;