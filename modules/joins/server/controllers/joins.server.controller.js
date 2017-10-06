'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Join = mongoose.model('Join'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Join
 */
exports.create = function(req, res) {
  var join = new Join(req.body);
  join.user = req.user;

  join.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(join);
    }
  });
};

/**
 * Show the current Join
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var join = req.join ? req.join.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  join.isCurrentUserOwner = req.user && join.user && join.user._id.toString() === req.user._id.toString();

  res.jsonp(join);
};

/**
 * Update a Join
 */
exports.update = function(req, res) {
  var join = req.join;

  join = _.extend(join, req.body);

  join.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(join);
    }
  });
};

/**
 * Delete an Join
 */
exports.delete = function(req, res) {
  var join = req.join;

  join.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(join);
    }
  });
};

/**
 * List of Joins
 */
exports.list = function(req, res) {
  Join.find().sort('-created').populate('user', 'displayName').exec(function(err, joins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(joins);
    }
  });
};

/**
 * Join middleware
 */
exports.joinByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Join is invalid'
    });
  }

  Join.findById(id).populate('user', 'displayName').exec(function (err, join) {
    if (err) {
      return next(err);
    } else if (!join) {
      return res.status(404).send({
        message: 'No Join with that identifier has been found'
      });
    }
    req.join = join;
    next();
  });
};
