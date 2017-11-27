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
    trim: true
  },
  text: {
    type: Array,
    default: '',
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
  description: {
    type: String,
    default: '',
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  year: {
    type: Number,
    default: '',
    trim: true
  },
  department: {
    type: String,
    default: '',
    trim: true
  },
  award: {
    type: String,
    default: '',
    trim: true
  },
});

mongoose.model('Newabout', NewaboutSchema);
