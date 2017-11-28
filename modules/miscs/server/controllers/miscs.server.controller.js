'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Misc = mongoose.model('Misc'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Misc
 */
exports.create = function(req, res) {
  var misc = new Misc(req.body);
  misc.user = req.user;

  misc.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(misc);
    }
  });
};

/**
 * Show the current Misc
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var misc = req.misc ? req.misc.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  misc.isCurrentUserOwner = req.user && misc.user && misc.user._id.toString() === req.user._id.toString();

  res.jsonp(misc);
};

/**
 * Update a Misc
 */
exports.update = function(req, res) {
  var misc = req.misc;

  misc = _.extend(misc, req.body);

  misc.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(misc);
    }
  });
};

/**
 * Delete an Misc
 */
exports.delete = function(req, res) {
  var misc = req.misc;

  misc.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(misc);
    }
  });
};

/**
 * List of Miscs
 */
exports.list = function(req, res) {
  Misc.find().sort('-created').populate('user', 'displayName').exec(function(err, miscs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(miscs);
    }
  });
};

/**
 * Misc middleware
 */
exports.miscByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Misc is invalid'
    });
  }

  Misc.findById(id).populate('user', 'displayName').exec(function (err, misc) {
    if (err) {
      return next(err);
    } else if (!misc) {
      return res.status(404).send({
        message: 'No Misc with that identifier has been found'
      });
    }
    req.misc = misc;
    next();
  });
};
