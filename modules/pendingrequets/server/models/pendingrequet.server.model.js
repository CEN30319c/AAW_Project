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
        required: 'Please enter your ful name',
        trim: true
    },
    email: {
        type: String,
        default: '',
        required: 'Please enter your email address',
        trim: true
    },

    phone: {
        type: Number,
        default: '',
        required: 'Please provide your campus phone number',
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
        required: 'Please, select an answer 2',
        trim: true
    },
    selection3: {
        type: String,
        default: 'Yes',
        required: 'Are you interested in joining an AAW committee?, select an answer',
        trim: true
    },

    interest: {
        type: String,
        default: '',
        // required: '',
        trim: true
    },

    topics: {
        type: String,
        default: '',
        // required: '',
        trim: true
    },

    selection4: {
        type: String,
        default: '',
        // required: 'Are you interested in having a profile? Please, select an answer',
        trim: true
    },

    motivation: {
        type: String,
        default: '',
        // required: '',
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

    filename: {
        type: String,
        default: ''
    },
    imageURL: {
        type: String,
        default: 'modules/pendingrequets/client/img/memberImages/default.png'
    },


});

mongoose.model('Pendingrequet', PendingrequetSchema);
