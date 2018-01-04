const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String
  },
  start: {
    lat: Number,
    long: Number
  },
  end: {
    lat: Number,
    long: Number
  },
  distanceTravelled: {
    type: Number
  },
  totalDistance: {
    type: Number
  }
});

module.exports = mongoose.model('Trip', TripSchema);