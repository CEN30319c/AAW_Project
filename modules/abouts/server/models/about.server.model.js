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
  name: {
    type: String,
    default: '',
    required: 'Please fill About name',
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

mongoose.model('About', AboutSchema);
