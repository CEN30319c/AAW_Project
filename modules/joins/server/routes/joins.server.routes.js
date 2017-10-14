'use strict';

/**
 * Module dependencies
 */
var joinsPolicy = require('../policies/joins.server.policy'),
  joins = require('../controllers/joins.server.controller');

module.exports = function(app) {
  // Joins Routes
  app.route('/api/joins').all(joinsPolicy.isAllowed)
    .get(joins.list)
    .post(joins.create);

  app.route('/api/joins/:joinId').all(joinsPolicy.isAllowed)
    .get(joins.read)
    .put(joins.update)
    .delete(joins.delete);

  // Finish by binding the Join middleware
  app.param('joinId', joins.joinByID);
};
