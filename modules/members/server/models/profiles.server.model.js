'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Member name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Member name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Profile', ProfileSchema);
