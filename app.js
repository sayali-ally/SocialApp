const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://your choice of data base ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
