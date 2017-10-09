var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var announcementSchema = new Schema({

  title: String,
  author: String,
  announcement: {
    type: String,
    required: true
  },

  created_at: Date,
  updated_at: Date


});

announcementSchema.pre('save', function(next) {
  var currentTime = new Date;

  this.updated_at = currentTime;
  if(!this.created_at) {
    this.created_at = currentTime
  }

  next();

});

var announcement = mongoose.model('Announcement', announcementSchema);

module.exports = announcement;
