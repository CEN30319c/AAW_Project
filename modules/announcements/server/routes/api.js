var Announcement = require('../models/announcements.server.model.js');
module.exports = function(router) {
  router.post('/announ', function(req, res) { //may have to change to post later
    var ann = new Announcement();
    ann.title = req.body.title;
    ann.author = req.body.author;
    ann.announcement = req.body.announcement;

    ann.save();

    res.send("Announcement Saved");

  });

  router.get('listAnnouncements', function(req, res) {
    Announcement.find().sort('title').exec(function(err, data) {
      if(err) {
        res.status(400).send(err);
      }

      else {
        res.json(data);
      }
    });
  });

  router.get('/', function(req, res) {
    res.send("Hello World");
  });

  return router;
}
