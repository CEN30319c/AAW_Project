'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Misc Schema
 */
var MiscSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Misc name',
    trim: true
  },
  data: {
    type: Array,
    default: '',
    required: 'Please fill Misc name',
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

mongoose.model('Misc', MiscSchema);
