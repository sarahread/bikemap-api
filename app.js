const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect(process.env.MONGO_DATABASE || 'mongodb://localhost/bikemap');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
  next();
});

app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth', require('./api/auth'));
app.use('/trips', require('./api/trips'));

const db = mongoose.connection;
db.once('open', function() {
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log('App now running on port', port);
  });
});

app.get('/foo', (req, res) => {
  res.end('bar');
});

module.exports = app;