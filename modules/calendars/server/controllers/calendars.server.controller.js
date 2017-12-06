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

var b;
var bodyError = [{title: 'ERROR', description: 'ERROR', begin: 'ERROR', end: 'ERROR', location: 'ERROR', beginMonth: 'ERROR', beginDay: 'ERROR', beginTime: 'ERROR', endMonth: 'ERROR', endDay: 'ERROR', endTime: 'ERROR', time: 'ERROR'}];


//get the .ical file and parsing it to get the events
exports.ical = function(req, response) {

  do {
    request('https://calendar.google.com/calendar/ical/aaw.florida%40gmail.com/public/basic.ics', 
      function(err, res, body) {  
        
        //handle error
        if (err) { return console.log(err); }

        //checking if body contains correct data
        if ((body[0] + body[1] + body[2] + body[3] + body[4]) == 'BEGIN') {
          
          // BODY IS GOOD SO PARSE
          var jcalData = ical.parse(body); //parse body with ical
          var vcalendar = new ical.Component(jcalData); //gets the calendar from the parsed data
          var vevents = vcalendar.getAllSubcomponents('vevent'); //gets all the events from the calendar
          var calendars = []; //array that will be returned at the end
          
          //for loop that goes over each event in vevents
          vevents.forEach(function(evt, ix, array) {
            var event = new ical.Event(evt); //making an event object
            var now = new Date(); //current date and time
            var dtstart = evt.getFirstPropertyValue('dtstart'); //getting the start date

            //making a date object with info from the start date
            var ds = new Date(Date.UTC(dtstart._time.year, dtstart._time.month - 1, dtstart._time.day, dtstart._time.hour, dtstart._time.minute, dtstart._time.second));
            
            var dtend = evt.getFirstPropertyValue('dtend'); //getting the end date

            //making a date object with info from the end date
            var de = new Date(Date.UTC(dtend._time.year, dtend._time.month - 1, dtend._time.day, dtend._time.hour, dtend._time.minute, dtend._time.second));
            
            var location = evt.getFirstPropertyValue('location'); //getting the location of the event

            //making the event object that will be pushed to the returned array
            var e = {title: event.summary, description: event.description, begin: ds.toLocaleString(), end: de.toLocaleString(), location: location.toLocaleString(), beginMonth: (ds.getMonth() + 1), beginDay: ds.getDate(), beginTime: ds.toLocaleTimeString(), endMonth: (de.getMonth() + 1), endDay: de.getDate(), endTime: de.toLocaleTimeString(), time: ds.getTime()};
            
            //if the event is in the future
            if (now.getTime() < de.getTime()) {
              calendars.push(e); //push event to the returned array
            }
          });

          b = calendars;
          response.send(calendars.sort(function(a,b){
            if (a.time < b.time)
              return -1;
            if (a.time > b.time)
              return -1;
            return 0;
          })); //return the array
        }
        else {
          // BODY IS BAD SO SEND ERRORS
          b = bodyError;
          response.send([{title: 'ERROR', description: 'ERROR', begin: 'ERROR', end: 'ERROR', location: 'ERROR', beginMonth: 'ERROR', beginDay: 'ERROR', beginTime: 'ERROR', endMonth: 'ERROR', endDay: 'ERROR', endTime: 'ERROR', time: 'ERROR'}]);
        }
      }
    );
  } while(b === '' || b === bodyError);
  b = '';
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
