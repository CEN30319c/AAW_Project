'use strict';

/**
 * Module dependencies
 */
var pendingrequetsPolicy = require('../policies/pendingrequets.server.policy'),
  pendingrequets = require('../controllers/pendingrequets.server.controller');

module.exports = function(app) {
  //Setting profile picture
  app.route('/api/pendingrequets/picture').all()
      .post(pendingrequets.uploadImage);

  app.route('/sign-s3').all()
    .get(pendingrequets.uploadImage);

  // Pendingrequets Routes
  app.route('/api/pendingrequets').all(pendingrequetsPolicy.isAllowed)
    .get(pendingrequets.list)
    .post(pendingrequets.create);

  app.route('/api/pendingrequets/:pendingrequetId').all(pendingrequetsPolicy.isAllowed)
    .get(pendingrequets.read)
    .put(pendingrequets.update)
    .delete(pendingrequets.delete);

  // Finish by binding the Pendingrequet middleware
  app.param('pendingrequetId', pendingrequets.pendingrequetByID);

  //Finish by sending email to admin
  app.route('/api/auth/notification').post(pendingrequets.sendMail);
};
