'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Meetingminute = mongoose.model('Meetingminute'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  meetingminute;

/**
 * Meetingminute routes tests
 */
describe('Meetingminute CRUD tests', function () {

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

    // Save a user to the test db and create new Meetingminute
    user.save(function () {
      meetingminute = {
        name: 'Meetingminute name'
      };

      done();
    });
  });

  it('should be able to save a Meetingminute if logged in', function (done) {
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

        // Save a new Meetingminute
        agent.post('/api/meetingminutes')
          .send(meetingminute)
          .expect(200)
          .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
            // Handle Meetingminute save error
            if (meetingminuteSaveErr) {
              return done(meetingminuteSaveErr);
            }

            // Get a list of Meetingminutes
            agent.get('/api/meetingminutes')
              .end(function (meetingminutesGetErr, meetingminutesGetRes) {
                // Handle Meetingminutes save error
                if (meetingminutesGetErr) {
                  return done(meetingminutesGetErr);
                }

                // Get Meetingminutes list
                var meetingminutes = meetingminutesGetRes.body;

                // Set assertions
                (meetingminutes[0].user._id).should.equal(userId);
                (meetingminutes[0].name).should.match('Meetingminute name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Meetingminute if not logged in', function (done) {
    agent.post('/api/meetingminutes')
      .send(meetingminute)
      .expect(403)
      .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
        // Call the assertion callback
        done(meetingminuteSaveErr);
      });
  });

  it('should not be able to save an Meetingminute if no name is provided', function (done) {
    // Invalidate name field
    meetingminute.name = '';

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

        // Save a new Meetingminute
        agent.post('/api/meetingminutes')
          .send(meetingminute)
          .expect(400)
          .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
            // Set message assertion
            (meetingminuteSaveRes.body.message).should.match('Please fill Meetingminute name');

            // Handle Meetingminute save error
            done(meetingminuteSaveErr);
          });
      });
  });

  it('should be able to update an Meetingminute if signed in', function (done) {
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

        // Save a new Meetingminute
        agent.post('/api/meetingminutes')
          .send(meetingminute)
          .expect(200)
          .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
            // Handle Meetingminute save error
            if (meetingminuteSaveErr) {
              return done(meetingminuteSaveErr);
            }

            // Update Meetingminute name
            meetingminute.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Meetingminute
            agent.put('/api/meetingminutes/' + meetingminuteSaveRes.body._id)
              .send(meetingminute)
              .expect(200)
              .end(function (meetingminuteUpdateErr, meetingminuteUpdateRes) {
                // Handle Meetingminute update error
                if (meetingminuteUpdateErr) {
                  return done(meetingminuteUpdateErr);
                }

                // Set assertions
                (meetingminuteUpdateRes.body._id).should.equal(meetingminuteSaveRes.body._id);
                (meetingminuteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Meetingminutes if not signed in', function (done) {
    // Create new Meetingminute model instance
    var meetingminuteObj = new Meetingminute(meetingminute);

    // Save the meetingminute
    meetingminuteObj.save(function () {
      // Request Meetingminutes
      request(app).get('/api/meetingminutes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Meetingminute if not signed in', function (done) {
    // Create new Meetingminute model instance
    var meetingminuteObj = new Meetingminute(meetingminute);

    // Save the Meetingminute
    meetingminuteObj.save(function () {
      request(app).get('/api/meetingminutes/' + meetingminuteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', meetingminute.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Meetingminute with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/meetingminutes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Meetingminute is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Meetingminute which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Meetingminute
    request(app).get('/api/meetingminutes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Meetingminute with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Meetingminute if signed in', function (done) {
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

        // Save a new Meetingminute
        agent.post('/api/meetingminutes')
          .send(meetingminute)
          .expect(200)
          .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
            // Handle Meetingminute save error
            if (meetingminuteSaveErr) {
              return done(meetingminuteSaveErr);
            }

            // Delete an existing Meetingminute
            agent.delete('/api/meetingminutes/' + meetingminuteSaveRes.body._id)
              .send(meetingminute)
              .expect(200)
              .end(function (meetingminuteDeleteErr, meetingminuteDeleteRes) {
                // Handle meetingminute error error
                if (meetingminuteDeleteErr) {
                  return done(meetingminuteDeleteErr);
                }

                // Set assertions
                (meetingminuteDeleteRes.body._id).should.equal(meetingminuteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Meetingminute if not signed in', function (done) {
    // Set Meetingminute user
    meetingminute.user = user;

    // Create new Meetingminute model instance
    var meetingminuteObj = new Meetingminute(meetingminute);

    // Save the Meetingminute
    meetingminuteObj.save(function () {
      // Try deleting Meetingminute
      request(app).delete('/api/meetingminutes/' + meetingminuteObj._id)
        .expect(403)
        .end(function (meetingminuteDeleteErr, meetingminuteDeleteRes) {
          // Set message assertion
          (meetingminuteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Meetingminute error error
          done(meetingminuteDeleteErr);
        });

    });
  });

  it('should be able to get a single Meetingminute that has an orphaned user reference', function (done) {
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

          // Save a new Meetingminute
          agent.post('/api/meetingminutes')
            .send(meetingminute)
            .expect(200)
            .end(function (meetingminuteSaveErr, meetingminuteSaveRes) {
              // Handle Meetingminute save error
              if (meetingminuteSaveErr) {
                return done(meetingminuteSaveErr);
              }

              // Set assertions on new Meetingminute
              (meetingminuteSaveRes.body.name).should.equal(meetingminute.name);
              should.exist(meetingminuteSaveRes.body.user);
              should.equal(meetingminuteSaveRes.body.user._id, orphanId);

              // force the Meetingminute to have an orphaned user reference
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

                    // Get the Meetingminute
                    agent.get('/api/meetingminutes/' + meetingminuteSaveRes.body._id)
                      .expect(200)
                      .end(function (meetingminuteInfoErr, meetingminuteInfoRes) {
                        // Handle Meetingminute error
                        if (meetingminuteInfoErr) {
                          return done(meetingminuteInfoErr);
                        }

                        // Set assertions
                        (meetingminuteInfoRes.body._id).should.equal(meetingminuteSaveRes.body._id);
                        (meetingminuteInfoRes.body.name).should.equal(meetingminute.name);
                        should.equal(meetingminuteInfoRes.body.user, undefined);

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
      Meetingminute.remove().exec(done);
    });
  });
});
