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
  year: Number,
  name: {
    type: String,
    default: '',
    required: 'Please fill Join name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  department: String,
  award: String
});

mongoose.model('About', AboutSchema);