'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meetingminute Schema
 */
var MeetingminuteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Meetingminute name',
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

mongoose.model('Meetingminute', MeetingminuteSchema);
