'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Misc = mongoose.model('Misc'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  misc;

/**
 * Misc routes tests
 */
describe('Misc CRUD tests', function () {

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

    // Save a user to the test db and create new Misc
    user.save(function () {
      misc = {
        name: 'Misc name'
      };

      done();
    });
  });

  it('should be able to save a Misc if logged in', function (done) {
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

        // Save a new Misc
        agent.post('/api/miscs')
          .send(misc)
          .expect(200)
          .end(function (miscSaveErr, miscSaveRes) {
            // Handle Misc save error
            if (miscSaveErr) {
              return done(miscSaveErr);
            }

            // Get a list of Miscs
            agent.get('/api/miscs')
              .end(function (miscsGetErr, miscsGetRes) {
                // Handle Miscs save error
                if (miscsGetErr) {
                  return done(miscsGetErr);
                }

                // Get Miscs list
                var miscs = miscsGetRes.body;

                // Set assertions
                (miscs[0].user._id).should.equal(userId);
                (miscs[0].name).should.match('Misc name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Misc if not logged in', function (done) {
    agent.post('/api/miscs')
      .send(misc)
      .expect(403)
      .end(function (miscSaveErr, miscSaveRes) {
        // Call the assertion callback
        done(miscSaveErr);
      });
  });

  it('should not be able to save an Misc if no name is provided', function (done) {
    // Invalidate name field
    misc.name = '';

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

        // Save a new Misc
        agent.post('/api/miscs')
          .send(misc)
          .expect(400)
          .end(function (miscSaveErr, miscSaveRes) {
            // Set message assertion
            (miscSaveRes.body.message).should.match('Please fill Misc name');

            // Handle Misc save error
            done(miscSaveErr);
          });
      });
  });

  it('should be able to update an Misc if signed in', function (done) {
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

        // Save a new Misc
        agent.post('/api/miscs')
          .send(misc)
          .expect(200)
          .end(function (miscSaveErr, miscSaveRes) {
            // Handle Misc save error
            if (miscSaveErr) {
              return done(miscSaveErr);
            }

            // Update Misc name
            misc.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Misc
            agent.put('/api/miscs/' + miscSaveRes.body._id)
              .send(misc)
              .expect(200)
              .end(function (miscUpdateErr, miscUpdateRes) {
                // Handle Misc update error
                if (miscUpdateErr) {
                  return done(miscUpdateErr);
                }

                // Set assertions
                (miscUpdateRes.body._id).should.equal(miscSaveRes.body._id);
                (miscUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Miscs if not signed in', function (done) {
    // Create new Misc model instance
    var miscObj = new Misc(misc);

    // Save the misc
    miscObj.save(function () {
      // Request Miscs
      request(app).get('/api/miscs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Misc if not signed in', function (done) {
    // Create new Misc model instance
    var miscObj = new Misc(misc);

    // Save the Misc
    miscObj.save(function () {
      request(app).get('/api/miscs/' + miscObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', misc.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Misc with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/miscs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Misc is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Misc which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Misc
    request(app).get('/api/miscs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Misc with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Misc if signed in', function (done) {
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

        // Save a new Misc
        agent.post('/api/miscs')
          .send(misc)
          .expect(200)
          .end(function (miscSaveErr, miscSaveRes) {
            // Handle Misc save error
            if (miscSaveErr) {
              return done(miscSaveErr);
            }

            // Delete an existing Misc
            agent.delete('/api/miscs/' + miscSaveRes.body._id)
              .send(misc)
              .expect(200)
              .end(function (miscDeleteErr, miscDeleteRes) {
                // Handle misc error error
                if (miscDeleteErr) {
                  return done(miscDeleteErr);
                }

                // Set assertions
                (miscDeleteRes.body._id).should.equal(miscSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Misc if not signed in', function (done) {
    // Set Misc user
    misc.user = user;

    // Create new Misc model instance
    var miscObj = new Misc(misc);

    // Save the Misc
    miscObj.save(function () {
      // Try deleting Misc
      request(app).delete('/api/miscs/' + miscObj._id)
        .expect(403)
        .end(function (miscDeleteErr, miscDeleteRes) {
          // Set message assertion
          (miscDeleteRes.body.message).should.match('User is not authorized');

          // Handle Misc error error
          done(miscDeleteErr);
        });

    });
  });

  it('should be able to get a single Misc that has an orphaned user reference', function (done) {
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

          // Save a new Misc
          agent.post('/api/miscs')
            .send(misc)
            .expect(200)
            .end(function (miscSaveErr, miscSaveRes) {
              // Handle Misc save error
              if (miscSaveErr) {
                return done(miscSaveErr);
              }

              // Set assertions on new Misc
              (miscSaveRes.body.name).should.equal(misc.name);
              should.exist(miscSaveRes.body.user);
              should.equal(miscSaveRes.body.user._id, orphanId);

              // force the Misc to have an orphaned user reference
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

                    // Get the Misc
                    agent.get('/api/miscs/' + miscSaveRes.body._id)
                      .expect(200)
                      .end(function (miscInfoErr, miscInfoRes) {
                        // Handle Misc error
                        if (miscInfoErr) {
                          return done(miscInfoErr);
                        }

                        // Set assertions
                        (miscInfoRes.body._id).should.equal(miscSaveRes.body._id);
                        (miscInfoRes.body.name).should.equal(misc.name);
                        should.equal(miscInfoRes.body.user, undefined);

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
      Misc.remove().exec(done);
    });
  });
});
