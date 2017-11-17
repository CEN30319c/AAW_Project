'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Calendar = mongoose.model('Calendar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  ical = require('ical.js');

exports.ical = function(req, response) {
    request('https://outlook.live.com/owa//calendar/00000000-0000-0000-0000-000000000000/c71946db-4cbb-4ca0-9af3-f5a34459cf28/cid-5939566F43ADC820/calendar.ics', function(err, res, body) {  
    if (err) { return console.log(err); }
    // console.log(body);
    if ((body[0] + body[1] + body[2] + body[3] + body[4]) == 'BEGIN') {
      // console.log('BODY IS GOOD SO PARSE');
      var jcalData = ical.parse(body);
      var vcalendar = new ical.Component(jcalData);
      var vevents = vcalendar.getAllSubcomponents('vevent');
      var calendars = [];
      vevents.forEach(function(evt, ix, array) {
        var event = new ical.Event(evt);
        var now = new Date();
        var dtstart = evt.getFirstPropertyValue('dtstart');
        var db = new Date(dtstart._time.year, dtstart._time.month - 1, dtstart._time.day, dtstart._time.hour, dtstart._time.minute, dtstart._time.second);
        var dtend = evt.getFirstPropertyValue('dtend');
        var de = new Date(dtend._time.year, dtend._time.month - 1, dtend._time.day, dtend._time.hour, dtend._time.minute, dtend._time.second);
        var location = evt.getFirstPropertyValue('location');
        var e = {title: event.summary, description: event.description, begin: db.toLocaleString(), end: de.toLocaleString(), location: location.toLocaleString()};
        if (now.getTime() < de.getTime()) {
          calendars.push(e);
        }
      });
      response.send(calendars);
    }
    else {
      // console.log('BODY IS BAD SO SEND ERRORS');
      response.send([{title: 'ERROR', description: 'ERROR', begin: 'ERROR', end: 'ERROR', location: 'ERROR'}]);
    }
  });
};

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
