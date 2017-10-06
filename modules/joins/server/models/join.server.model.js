'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Join Schema
 */
var JoinSchema = new Schema({
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
  }
});

mongoose.model('Join', JoinSchema);
