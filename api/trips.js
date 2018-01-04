const express = require('express');
const passport = require('passport');
const router = express.Router();
const Trip = require('../models/trip');

router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const newTrip = new Trip({
    totalDistance: req.body.totalDistance,
    name: req.body.name,
    user: req.user
  });

  newTrip.save((err, trip) => {
    if (err) {
      return res.status(500).json({ success: false, msg: 'There was a problem creating a trip.' });
    }

    res.json({ success: true, trip });
  });
});

module.exports = router;