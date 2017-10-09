var mongoose = require('mongoose');
var Announcement = require('../models/announcements.server.model.js');

//mongoose.connect(config.db.uri);

 exports.getAllAnnouncements = function() {
  Announcement.find({}, function(err, data) {
    if(err != null) {
      throw err;
    }

    else {
      console.log(data);
      return data;
    }
  });
};

exports.insertAnnouncement = function(newAnnouncement) {
  newAnnouncement.save();
};
