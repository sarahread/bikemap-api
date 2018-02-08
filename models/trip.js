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
    lng: Number
  },
  end: {
    lat: Number,
    lng: Number
  },
  distanceTravelled: {
    type: Number
  },
  totalDistance: {
    type: Number
  },
  path: [String]
});

module.exports = mongoose.model('Trip', TripSchema);