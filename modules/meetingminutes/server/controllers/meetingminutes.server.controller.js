'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meetingminute = mongoose.model('Meetingminute'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meetingminute
 */
exports.create = function(req, res) {
  var meetingminute = new Meetingminute(req.body);
  meetingminute.user = req.user;

  meetingminute.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetingminute);
    }
  });
};

/**
 * Show the current Meetingminute
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var meetingminute = req.meetingminute ? req.meetingminute.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  meetingminute.isCurrentUserOwner = req.user && meetingminute.user && meetingminute.user._id.toString() === req.user._id.toString();

  res.jsonp(meetingminute);
};

/**
 * Update a Meetingminute
 */
exports.update = function(req, res) {
  var meetingminute = req.meetingminute;

  meetingminute = _.extend(meetingminute, req.body);

  meetingminute.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetingminute);
    }
  });
};

/**
 * Delete an Meetingminute
 */
exports.delete = function(req, res) {
  var meetingminute = req.meetingminute;

  meetingminute.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetingminute);
    }
  });
};

/**
 * List of Meetingminutes
 */
exports.list = function(req, res) {
  Meetingminute.find().sort('-created').populate('user', 'displayName').exec(function(err, meetingminutes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetingminutes);
    }
  });
};

/**
 * Meetingminute middleware
 */
exports.meetingminuteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Meetingminute is invalid'
    });
  }

  Meetingminute.findById(id).populate('user', 'displayName').exec(function (err, meetingminute) {
    if (err) {
      return next(err);
    } else if (!meetingminute) {
      return res.status(404).send({
        message: 'No Meetingminute with that identifier has been found'
      });
    }
    req.meetingminute = meetingminute;
    next();
  });
};
