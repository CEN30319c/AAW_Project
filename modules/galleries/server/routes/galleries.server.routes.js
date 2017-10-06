'use strict';

/**
 * Module dependencies
 */
var galleriesPolicy = require('../policies/galleries.server.policy'),
  galleries = require('../controllers/galleries.server.controller');

module.exports = function(app) {
  // Galleries Routes
  app.route('/api/galleries').all(galleriesPolicy.isAllowed)
    .get(galleries.list)
    .post(galleries.create);

  app.route('/api/galleries/:galleryId').all(galleriesPolicy.isAllowed)
    .get(galleries.read)
    .put(galleries.update)
    .delete(galleries.delete);

  // Finish by binding the Gallery middleware
  app.param('galleryId', galleries.galleryByID);
};
