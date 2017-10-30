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
    required: 'Please fill with your email address',
    trim: true
  },

  phone: {
    type: Number,
    default: '',
    required: 'Please fill with your campus phone number',
    trim: true
  },

  college: {
    type: String,
    default: '',
    required: '',
    trim: true
  },

  position: {
    type: String,
    default: '',
    required: '',
    trim: true
  },
  selection: {
      type: String,
      default: '',
      required: 'Please select your role in campus',
      trim: true
  },

  yearsUf: {
      type: Number,
      default: '',
      required: '',
      trim: true
  },

  selection2: {
    type: String,
    default: '',
    required: 'Please, select an answer',
    trim: true
  },
  selection3: {
    type: String,
    default: '',
    required: 'Please, select an answer',
    trim: true
  },
  // firstTimeYes: {
  //     type: String,
  //     default: '',
  //     required: 'Please select Yes or No',
  //     trim: true
  // },
  // firstTimeNo: {
  //     type: String,
  //     default: '',
  //     required: 'Please select Yes or No',
  //     trim: true
  // },

  joinYes: {
      type: String,
      default: '',
      required: 'Please select Yes or No',
      trim: true
  },
  joinNo: {
      type: String,
      default: '',
      required: 'Please select Yes or No',
      trim: true
  },
  interest: {
    type: String,
    default: '',
    required: '',
    trim: true
  },

  topics: {
      type: String,
      default: '',
      required: '',
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
