'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Join = mongoose.model('Join'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  join;

/**
 * Join routes tests
 */
describe('Join CRUD tests', function () {

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

    // Save a user to the test db and create new Join
    user.save(function () {
      join = {
        name: 'Join name'
      };

      done();
    });
  });

  it('should be able to save a Join if logged in', function (done) {
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

        // Save a new Join
        agent.post('/api/joins')
          .send(join)
          .expect(200)
          .end(function (joinSaveErr, joinSaveRes) {
            // Handle Join save error
            if (joinSaveErr) {
              return done(joinSaveErr);
            }

            // Get a list of Joins
            agent.get('/api/joins')
              .end(function (joinsGetErr, joinsGetRes) {
                // Handle Joins save error
                if (joinsGetErr) {
                  return done(joinsGetErr);
                }

                // Get Joins list
                var joins = joinsGetRes.body;

                // Set assertions
                (joins[0].user._id).should.equal(userId);
                (joins[0].name).should.match('Join name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Join if not logged in', function (done) {
    agent.post('/api/joins')
      .send(join)
      .expect(403)
      .end(function (joinSaveErr, joinSaveRes) {
        // Call the assertion callback
        done(joinSaveErr);
      });
  });

  it('should not be able to save an Join if no name is provided', function (done) {
    // Invalidate name field
    join.name = '';

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

        // Save a new Join
        agent.post('/api/joins')
          .send(join)
          .expect(400)
          .end(function (joinSaveErr, joinSaveRes) {
            // Set message assertion
            (joinSaveRes.body.message).should.match('Please fill Join name');

            // Handle Join save error
            done(joinSaveErr);
          });
      });
  });

  it('should be able to update an Join if signed in', function (done) {
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

        // Save a new Join
        agent.post('/api/joins')
          .send(join)
          .expect(200)
          .end(function (joinSaveErr, joinSaveRes) {
            // Handle Join save error
            if (joinSaveErr) {
              return done(joinSaveErr);
            }

            // Update Join name
            join.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Join
            agent.put('/api/joins/' + joinSaveRes.body._id)
              .send(join)
              .expect(200)
              .end(function (joinUpdateErr, joinUpdateRes) {
                // Handle Join update error
                if (joinUpdateErr) {
                  return done(joinUpdateErr);
                }

                // Set assertions
                (joinUpdateRes.body._id).should.equal(joinSaveRes.body._id);
                (joinUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Joins if not signed in', function (done) {
    // Create new Join model instance
    var joinObj = new Join(join);

    // Save the join
    joinObj.save(function () {
      // Request Joins
      request(app).get('/api/joins')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Join if not signed in', function (done) {
    // Create new Join model instance
    var joinObj = new Join(join);

    // Save the Join
    joinObj.save(function () {
      request(app).get('/api/joins/' + joinObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', join.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Join with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/joins/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Join is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Join which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Join
    request(app).get('/api/joins/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Join with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Join if signed in', function (done) {
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

        // Save a new Join
        agent.post('/api/joins')
          .send(join)
          .expect(200)
          .end(function (joinSaveErr, joinSaveRes) {
            // Handle Join save error
            if (joinSaveErr) {
              return done(joinSaveErr);
            }

            // Delete an existing Join
            agent.delete('/api/joins/' + joinSaveRes.body._id)
              .send(join)
              .expect(200)
              .end(function (joinDeleteErr, joinDeleteRes) {
                // Handle join error error
                if (joinDeleteErr) {
                  return done(joinDeleteErr);
                }

                // Set assertions
                (joinDeleteRes.body._id).should.equal(joinSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Join if not signed in', function (done) {
    // Set Join user
    join.user = user;

    // Create new Join model instance
    var joinObj = new Join(join);

    // Save the Join
    joinObj.save(function () {
      // Try deleting Join
      request(app).delete('/api/joins/' + joinObj._id)
        .expect(403)
        .end(function (joinDeleteErr, joinDeleteRes) {
          // Set message assertion
          (joinDeleteRes.body.message).should.match('User is not authorized');

          // Handle Join error error
          done(joinDeleteErr);
        });

    });
  });

  it('should be able to get a single Join that has an orphaned user reference', function (done) {
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

          // Save a new Join
          agent.post('/api/joins')
            .send(join)
            .expect(200)
            .end(function (joinSaveErr, joinSaveRes) {
              // Handle Join save error
              if (joinSaveErr) {
                return done(joinSaveErr);
              }

              // Set assertions on new Join
              (joinSaveRes.body.name).should.equal(join.name);
              should.exist(joinSaveRes.body.user);
              should.equal(joinSaveRes.body.user._id, orphanId);

              // force the Join to have an orphaned user reference
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

                    // Get the Join
                    agent.get('/api/joins/' + joinSaveRes.body._id)
                      .expect(200)
                      .end(function (joinInfoErr, joinInfoRes) {
                        // Handle Join error
                        if (joinInfoErr) {
                          return done(joinInfoErr);
                        }

                        // Set assertions
                        (joinInfoRes.body._id).should.equal(joinSaveRes.body._id);
                        (joinInfoRes.body.name).should.equal(join.name);
                        should.equal(joinInfoRes.body.user, undefined);

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
      Join.remove().exec(done);
    });
  });
});
