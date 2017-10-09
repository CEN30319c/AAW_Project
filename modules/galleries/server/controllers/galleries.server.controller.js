'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Gallery = mongoose.model('Gallery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Gallery
 */
exports.create = function(req, res) {
  var gallery = new Gallery(req.body);
  gallery.user = req.user;

  gallery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gallery);
    }
  });
};

/**
 * Show the current Gallery
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var gallery = req.gallery ? req.gallery.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  gallery.isCurrentUserOwner = req.user && gallery.user && gallery.user._id.toString() === req.user._id.toString();

  res.jsonp(gallery);
};

/**
 * Update a Gallery
 */
exports.update = function(req, res) {
  var gallery = req.gallery;

  gallery = _.extend(gallery, req.body);

  gallery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gallery);
    }
  });
};

/**
 * Delete an Gallery
 */
exports.delete = function(req, res) {
  var gallery = req.gallery;

  gallery.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gallery);
    }
  });
};

/**
 * List of Galleries
 */
exports.list = function(req, res) {
  Gallery.find().sort('-created').populate('user', 'displayName').exec(function(err, galleries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(galleries);
    }
  });
};

/**
 * Gallery middleware
 */
exports.galleryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Gallery is invalid'
    });
  }

  Gallery.findById(id).populate('user', 'displayName').exec(function (err, gallery) {
    if (err) {
      return next(err);
    } else if (!gallery) {
      return res.status(404).send({
        message: 'No Gallery with that identifier has been found'
      });
    }
    req.gallery = gallery;
    next();
  });
};
