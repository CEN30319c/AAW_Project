'use strict';

/**
 * Module dependencies
 */
var miscsPolicy = require('../policies/miscs.server.policy'),
  miscs = require('../controllers/miscs.server.controller');

module.exports = function(app) {
  // Miscs Routes
  app.route('/api/miscs').all(miscsPolicy.isAllowed)
    .get(miscs.list)
    .post(miscs.create);

  app.route('/api/miscs/:miscId').all(miscsPolicy.isAllowed)
    .get(miscs.read)
    .put(miscs.update)
    .delete(miscs.delete);

  // Finish by binding the Misc middleware
  app.param('miscId', miscs.miscByID);
};
