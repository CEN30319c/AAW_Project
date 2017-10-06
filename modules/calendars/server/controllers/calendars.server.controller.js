'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Calendar = mongoose.model('Calendar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Calendar
 */
exports.create = function(req, res) {
  var calendar = new Calendar(req.body);
  calendar.user = req.user;

  calendar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendar);
    }
  });
};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var calendar = req.calendar ? req.calendar.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  calendar.isCurrentUserOwner = req.user && calendar.user && calendar.user._id.toString() === req.user._id.toString();

  res.jsonp(calendar);
};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {
  var calendar = req.calendar;

  calendar = _.extend(calendar, req.body);

  calendar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendar);
    }
  });
};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {
  var calendar = req.calendar;

  calendar.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendar);
    }
  });
};

/**
 * List of Calendars
 */
exports.list = function(req, res) {
  Calendar.find().sort('-created').populate('user', 'displayName').exec(function(err, calendars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendars);
    }
  });
};

/**
 * Calendar middleware
 */
exports.calendarByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Calendar is invalid'
    });
  }

  Calendar.findById(id).populate('user', 'displayName').exec(function (err, calendar) {
    if (err) {
      return next(err);
    } else if (!calendar) {
      return res.status(404).send({
        message: 'No Calendar with that identifier has been found'
      });
    }
    req.calendar = calendar;
    next();
  });
};
