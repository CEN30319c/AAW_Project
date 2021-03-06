'use strict';

/**
 * Module dependencies
 */
var membersPolicy = require('../policies/members.server.policy'),
  members = require('../controllers/members.server.controller');

module.exports = function(app) {
  //Setting profile picture
  app.route('/api/members/picture').all()
    .post(members.uploadImageDB);

  app.route('/sign-s3').all()
    .get(members.uploadImage);

  // Members Routes
  app.route('/api/members').all(membersPolicy.isAllowed)
    .get(members.list)
    .post(members.create);

  app.route('/api/members/:memberId').all(membersPolicy.isAllowed)
    .get(members.read)
    .put(members.update)
    .delete(members.delete);

  // Finish by binding the Member middleware
  app.param('memberId', members.memberByID);
};
