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
  contentType: String,
  text: {
    type: String,
    default: '',
    required: 'Please fill Join name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('About', AboutSchema);
