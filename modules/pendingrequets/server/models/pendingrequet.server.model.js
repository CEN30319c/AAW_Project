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
  email: {
    type: String,
    default: '',
    required: 'Please fill Email',
    trim: true
  },

  phone: {
    type: Number,
    default: '',
    required: 'Please fill with your campus phone number',
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






});

mongoose.model('Pendingrequet', PendingrequetSchema);
