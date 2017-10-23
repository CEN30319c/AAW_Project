'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Test Schema
 */
var TestSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Test name',
    trim: true
  },
  news: {
    type: String,
    default: '',
    required: 'Please fill News',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Test', TestSchema);
