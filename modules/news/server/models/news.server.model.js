'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsSchema = new Schema({

  title: String,
  author: String,
  announcement: {
    type: String,
    required: true
  },

  created_at: Date,
  updated_at: Date


});

NewsSchema.pre('save', function(next) {
  var currentTime = new Date;

  this.updated_at = currentTime;
  if(!this.created_at) {
    this.created_at = currentTime
  }

  next();

});

var news = mongoose.model('News', NewsSchema);

module.exports = news;

// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;
//
// /**
//  * News Schema
//  */
// var NewsSchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill News name',
//     trim: true
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   }
// });
//
// mongoose.model('News', NewsSchema);
