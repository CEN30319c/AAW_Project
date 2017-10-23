'use strict';

/**
 * Module dependencies
 */
var testsPolicy = require('../policies/tests.server.policy'),
  tests = require('../controllers/tests.server.controller');

module.exports = function(app) {
  // Tests Routes
  app.route('/api/tests').all(testsPolicy.isAllowed)
    .get(tests.list)
    .post(tests.create);

  app.route('/api/tests/:testId').all(testsPolicy.isAllowed)
    .get(tests.read)
    .put(tests.update)
    .delete(tests.delete);

  // Finish by binding the Test middleware
  app.param('testId', tests.testByID);
};
