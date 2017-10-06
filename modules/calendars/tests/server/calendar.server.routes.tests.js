'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Calendar = mongoose.model('Calendar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  calendar;

/**
 * Calendar routes tests
 */
describe('Calendar CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Calendar
    user.save(function () {
      calendar = {
        name: 'Calendar name'
      };

      done();
    });
  });

  it('should be able to save a Calendar if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle Calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Get a list of Calendars
            agent.get('/api/calendars')
              .end(function (calendarsGetErr, calendarsGetRes) {
                // Handle Calendars save error
                if (calendarsGetErr) {
                  return done(calendarsGetErr);
                }

                // Get Calendars list
                var calendars = calendarsGetRes.body;

                // Set assertions
                (calendars[0].user._id).should.equal(userId);
                (calendars[0].name).should.match('Calendar name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Calendar if not logged in', function (done) {
    agent.post('/api/calendars')
      .send(calendar)
      .expect(403)
      .end(function (calendarSaveErr, calendarSaveRes) {
        // Call the assertion callback
        done(calendarSaveErr);
      });
  });

  it('should not be able to save an Calendar if no name is provided', function (done) {
    // Invalidate name field
    calendar.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(400)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Set message assertion
            (calendarSaveRes.body.message).should.match('Please fill Calendar name');

            // Handle Calendar save error
            done(calendarSaveErr);
          });
      });
  });

  it('should be able to update an Calendar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle Calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Update Calendar name
            calendar.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Calendar
            agent.put('/api/calendars/' + calendarSaveRes.body._id)
              .send(calendar)
              .expect(200)
              .end(function (calendarUpdateErr, calendarUpdateRes) {
                // Handle Calendar update error
                if (calendarUpdateErr) {
                  return done(calendarUpdateErr);
                }

                // Set assertions
                (calendarUpdateRes.body._id).should.equal(calendarSaveRes.body._id);
                (calendarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Calendars if not signed in', function (done) {
    // Create new Calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the calendar
    calendarObj.save(function () {
      // Request Calendars
      request(app).get('/api/calendars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Calendar if not signed in', function (done) {
    // Create new Calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the Calendar
    calendarObj.save(function () {
      request(app).get('/api/calendars/' + calendarObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', calendar.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Calendar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/calendars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Calendar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Calendar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Calendar
    request(app).get('/api/calendars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Calendar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Calendar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle Calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Delete an existing Calendar
            agent.delete('/api/calendars/' + calendarSaveRes.body._id)
              .send(calendar)
              .expect(200)
              .end(function (calendarDeleteErr, calendarDeleteRes) {
                // Handle calendar error error
                if (calendarDeleteErr) {
                  return done(calendarDeleteErr);
                }

                // Set assertions
                (calendarDeleteRes.body._id).should.equal(calendarSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Calendar if not signed in', function (done) {
    // Set Calendar user
    calendar.user = user;

    // Create new Calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the Calendar
    calendarObj.save(function () {
      // Try deleting Calendar
      request(app).delete('/api/calendars/' + calendarObj._id)
        .expect(403)
        .end(function (calendarDeleteErr, calendarDeleteRes) {
          // Set message assertion
          (calendarDeleteRes.body.message).should.match('User is not authorized');

          // Handle Calendar error error
          done(calendarDeleteErr);
        });

    });
  });

  it('should be able to get a single Calendar that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Calendar
          agent.post('/api/calendars')
            .send(calendar)
            .expect(200)
            .end(function (calendarSaveErr, calendarSaveRes) {
              // Handle Calendar save error
              if (calendarSaveErr) {
                return done(calendarSaveErr);
              }

              // Set assertions on new Calendar
              (calendarSaveRes.body.name).should.equal(calendar.name);
              should.exist(calendarSaveRes.body.user);
              should.equal(calendarSaveRes.body.user._id, orphanId);

              // force the Calendar to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Calendar
                    agent.get('/api/calendars/' + calendarSaveRes.body._id)
                      .expect(200)
                      .end(function (calendarInfoErr, calendarInfoRes) {
                        // Handle Calendar error
                        if (calendarInfoErr) {
                          return done(calendarInfoErr);
                        }

                        // Set assertions
                        (calendarInfoRes.body._id).should.equal(calendarSaveRes.body._id);
                        (calendarInfoRes.body.name).should.equal(calendar.name);
                        should.equal(calendarInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Calendar.remove().exec(done);
    });
  });
});
