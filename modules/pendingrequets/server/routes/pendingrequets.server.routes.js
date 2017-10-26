'use strict';

/**
 * Module dependencies
 */
var pendingrequetsPolicy = require('../policies/pendingrequets.server.policy'),
  pendingrequets = require('../controllers/pendingrequets.server.controller');

module.exports = function(app) {
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
};
