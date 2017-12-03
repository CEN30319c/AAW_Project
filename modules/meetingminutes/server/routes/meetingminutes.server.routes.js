'use strict';

/**
 * Module dependencies
 */
var meetingminutesPolicy = require('../policies/meetingminutes.server.policy'),
  meetingminutes = require('../controllers/meetingminutes.server.controller');

module.exports = function(app) {
  // Meetingminutes Routes
  app.route('/api/meetingminutes').all(meetingminutesPolicy.isAllowed)
    .get(meetingminutes.list)
    .post(meetingminutes.create);

  app.route('/api/meetingminutes/:meetingminuteId').all(meetingminutesPolicy.isAllowed)
    .get(meetingminutes.read)
    .put(meetingminutes.update)
    .delete(meetingminutes.delete);

  // Finish by binding the Meetingminute middleware
  app.param('meetingminuteId', meetingminutes.meetingminuteByID);
};
