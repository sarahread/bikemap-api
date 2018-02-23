const express = require('express');
const passport = require('passport');
const router = express.Router();
const Trip = require('../models/trip');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
      return res.status(400).json({msg: 'There was a problem creating a trip'});
    }

    res.json(trip);
  });
});

router.get('/', passport.authenticate('jwt'), (req, res) => {
  Trip.find({user: ObjectId(req.user._id)}, (err, trips) => {
    if (err) {
      return res.status(400).json({msg: 'There was a problem retrieving trips'});
    }

    trips.map(t => {
      t.user = t.user._id;
    });

    res.json(trips);
  });
});

router.delete('/:id', passport.authenticate('jwt'), (req, res) => {
  Trip.remove({user: ObjectId(req.user._id), _id: ObjectId(req.params.id)}, (err, trips) => {
    if (err) {
      return res.status(400).json({msg: 'There was a problem deleting trip'});
    }

    res.json();
  });
});

module.exports = router;