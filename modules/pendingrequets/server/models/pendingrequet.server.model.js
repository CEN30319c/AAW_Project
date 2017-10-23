'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pendingrequet Schema
 */
var PendingrequetSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pendingrequet name',
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

mongoose.model('Pendingrequet', PendingrequetSchema);
