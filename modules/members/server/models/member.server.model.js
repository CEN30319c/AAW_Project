'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Member Schema
 */
var MemberSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Member name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Member description',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Member', MemberSchema);
