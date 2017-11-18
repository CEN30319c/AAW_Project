'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newabout Schema
 */
var NewaboutSchema = new Schema({
  contentType: {
    type: String,
    default: '',
    required: 'Please fill Content Type',
    trim: true
  },
  text: {
    type: Array,
    default: '',
    required: 'Please fill Content Type',
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

mongoose.model('Newabout', NewaboutSchema);
