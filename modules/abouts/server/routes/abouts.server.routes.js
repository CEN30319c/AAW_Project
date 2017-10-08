'use strict';

/**
 * Module dependencies
 */
var aboutsPolicy = require('../policies/abouts.server.policy'),
  abouts = require('../controllers/abouts.server.controller');

module.exports = function(app) {
  // Abouts Routes
  app.route('/api/abouts').all(aboutsPolicy.isAllowed)
    .get(abouts.list)
    .post(abouts.create);

  app.route('/api/abouts/:aboutId').all(aboutsPolicy.isAllowed)
    .get(abouts.read)
    .put(abouts.update)
    .delete(abouts.delete);

  // Finish by binding the About middleware
  app.param('aboutId', abouts.aboutByID);
};
