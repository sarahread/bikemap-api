const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  start: {
    query: String,
    lat: Number,
    lng: Number
  },
  end: {
    query: String,
    lat: Number,
    lng: Number
  },
  progress: [Number],
  totalDistance: Number,
  path: [String]
});

module.exports = mongoose.model('Trip', TripSchema);