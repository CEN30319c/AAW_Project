'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  About = mongoose.model('About'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a About
 */
exports.create = function(req, res) {
  var about = new About(req.body);
  about.user = req.user;

  about.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(about);
    }
  });
};

/**
 * Show the current About
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var about = req.about ? req.about.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  about.isCurrentUserOwner = req.user && about.user && about.user._id.toString() === req.user._id.toString();

  res.jsonp(about);
};

/**
 * Update a About
 */
exports.update = function(req, res) {
  var about = req.about;

  about = _.extend(about, req.body);

  about.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(about);
    }
  });
};

/**
 * Delete an About
 */
exports.delete = function(req, res) {
  var about = req.about;

  about.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(about);
    }
  });
};

/**
 * List of Abouts
 */
exports.list = function(req, res) {
  About.find().sort('-created').populate('user', 'displayName').exec(function(err, abouts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(abouts);
    }
  });
};

/**
 * About middleware
 */
exports.aboutByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'About is invalid'
    });
  }

  About.findById(id).populate('user', 'displayName').exec(function (err, about) {
    if (err) {
      return next(err);
    } else if (!about) {
      return res.status(404).send({
        message: 'No About with that identifier has been found'
      });
    }
    req.about = about;
    next();
  });
};
