'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pendingrequet = mongoose.model('Pendingrequet'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pendingrequet;

/**
 * Pendingrequet routes tests
 */
describe('Pendingrequet CRUD tests', function () {

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

    // Save a user to the test db and create new Pendingrequet
    user.save(function () {
      pendingrequet = {
        name: 'Pendingrequet name'
      };

      done();
    });
  });

  it('should be able to save a Pendingrequet if logged in', function (done) {
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

        // Save a new Pendingrequet
        agent.post('/api/pendingrequets')
          .send(pendingrequet)
          .expect(200)
          .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
            // Handle Pendingrequet save error
            if (pendingrequetSaveErr) {
              return done(pendingrequetSaveErr);
            }

            // Get a list of Pendingrequets
            agent.get('/api/pendingrequets')
              .end(function (pendingrequetsGetErr, pendingrequetsGetRes) {
                // Handle Pendingrequets save error
                if (pendingrequetsGetErr) {
                  return done(pendingrequetsGetErr);
                }

                // Get Pendingrequets list
                var pendingrequets = pendingrequetsGetRes.body;

                // Set assertions
                (pendingrequets[0].user._id).should.equal(userId);
                (pendingrequets[0].name).should.match('Pendingrequet name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pendingrequet if not logged in', function (done) {
    agent.post('/api/pendingrequets')
      .send(pendingrequet)
      .expect(403)
      .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
        // Call the assertion callback
        done(pendingrequetSaveErr);
      });
  });

  it('should not be able to save an Pendingrequet if no name is provided', function (done) {
    // Invalidate name field
    pendingrequet.name = '';

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

        // Save a new Pendingrequet
        agent.post('/api/pendingrequets')
          .send(pendingrequet)
          .expect(400)
          .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
            // Set message assertion
            (pendingrequetSaveRes.body.message).should.match('Please fill Pendingrequet name');

            // Handle Pendingrequet save error
            done(pendingrequetSaveErr);
          });
      });
  });

  it('should be able to update an Pendingrequet if signed in', function (done) {
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

        // Save a new Pendingrequet
        agent.post('/api/pendingrequets')
          .send(pendingrequet)
          .expect(200)
          .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
            // Handle Pendingrequet save error
            if (pendingrequetSaveErr) {
              return done(pendingrequetSaveErr);
            }

            // Update Pendingrequet name
            pendingrequet.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pendingrequet
            agent.put('/api/pendingrequets/' + pendingrequetSaveRes.body._id)
              .send(pendingrequet)
              .expect(200)
              .end(function (pendingrequetUpdateErr, pendingrequetUpdateRes) {
                // Handle Pendingrequet update error
                if (pendingrequetUpdateErr) {
                  return done(pendingrequetUpdateErr);
                }

                // Set assertions
                (pendingrequetUpdateRes.body._id).should.equal(pendingrequetSaveRes.body._id);
                (pendingrequetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pendingrequets if not signed in', function (done) {
    // Create new Pendingrequet model instance
    var pendingrequetObj = new Pendingrequet(pendingrequet);

    // Save the pendingrequet
    pendingrequetObj.save(function () {
      // Request Pendingrequets
      request(app).get('/api/pendingrequets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pendingrequet if not signed in', function (done) {
    // Create new Pendingrequet model instance
    var pendingrequetObj = new Pendingrequet(pendingrequet);

    // Save the Pendingrequet
    pendingrequetObj.save(function () {
      request(app).get('/api/pendingrequets/' + pendingrequetObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pendingrequet.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pendingrequet with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pendingrequets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pendingrequet is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pendingrequet which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pendingrequet
    request(app).get('/api/pendingrequets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pendingrequet with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pendingrequet if signed in', function (done) {
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

        // Save a new Pendingrequet
        agent.post('/api/pendingrequets')
          .send(pendingrequet)
          .expect(200)
          .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
            // Handle Pendingrequet save error
            if (pendingrequetSaveErr) {
              return done(pendingrequetSaveErr);
            }

            // Delete an existing Pendingrequet
            agent.delete('/api/pendingrequets/' + pendingrequetSaveRes.body._id)
              .send(pendingrequet)
              .expect(200)
              .end(function (pendingrequetDeleteErr, pendingrequetDeleteRes) {
                // Handle pendingrequet error error
                if (pendingrequetDeleteErr) {
                  return done(pendingrequetDeleteErr);
                }

                // Set assertions
                (pendingrequetDeleteRes.body._id).should.equal(pendingrequetSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pendingrequet if not signed in', function (done) {
    // Set Pendingrequet user
    pendingrequet.user = user;

    // Create new Pendingrequet model instance
    var pendingrequetObj = new Pendingrequet(pendingrequet);

    // Save the Pendingrequet
    pendingrequetObj.save(function () {
      // Try deleting Pendingrequet
      request(app).delete('/api/pendingrequets/' + pendingrequetObj._id)
        .expect(403)
        .end(function (pendingrequetDeleteErr, pendingrequetDeleteRes) {
          // Set message assertion
          (pendingrequetDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pendingrequet error error
          done(pendingrequetDeleteErr);
        });

    });
  });

  it('should be able to get a single Pendingrequet that has an orphaned user reference', function (done) {
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

          // Save a new Pendingrequet
          agent.post('/api/pendingrequets')
            .send(pendingrequet)
            .expect(200)
            .end(function (pendingrequetSaveErr, pendingrequetSaveRes) {
              // Handle Pendingrequet save error
              if (pendingrequetSaveErr) {
                return done(pendingrequetSaveErr);
              }

              // Set assertions on new Pendingrequet
              (pendingrequetSaveRes.body.name).should.equal(pendingrequet.name);
              should.exist(pendingrequetSaveRes.body.user);
              should.equal(pendingrequetSaveRes.body.user._id, orphanId);

              // force the Pendingrequet to have an orphaned user reference
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

                    // Get the Pendingrequet
                    agent.get('/api/pendingrequets/' + pendingrequetSaveRes.body._id)
                      .expect(200)
                      .end(function (pendingrequetInfoErr, pendingrequetInfoRes) {
                        // Handle Pendingrequet error
                        if (pendingrequetInfoErr) {
                          return done(pendingrequetInfoErr);
                        }

                        // Set assertions
                        (pendingrequetInfoRes.body._id).should.equal(pendingrequetSaveRes.body._id);
                        (pendingrequetInfoRes.body.name).should.equal(pendingrequet.name);
                        should.equal(pendingrequetInfoRes.body.user, undefined);

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
      Pendingrequet.remove().exec(done);
    });
  });
});
