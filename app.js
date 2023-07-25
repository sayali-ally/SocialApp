const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://your choice of data base ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Have created a user model
const User = mongoose.model('User', {
    name: String,
})
// Created Group model
const Group = mongoose.model('Group', {
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });