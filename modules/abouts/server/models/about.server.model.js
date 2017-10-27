'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * About Schema
 */
var AboutSchema = new Schema({
  year: String,
  name: {
    type: String,
    required: true
  },
  department: String
});

mongoose.model('About', AboutSchema);