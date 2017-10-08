'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  About = mongoose.model('About'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  about;

/**
 * About routes tests
 */
describe('About CRUD tests', function () {

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

    // Save a user to the test db and create new About
    user.save(function () {
      about = {
        name: 'About name'
      };

      done();
    });
  });

  it('should be able to save a About if logged in', function (done) {
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

        // Save a new About
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle About save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Get a list of Abouts
            agent.get('/api/abouts')
              .end(function (aboutsGetErr, aboutsGetRes) {
                // Handle Abouts save error
                if (aboutsGetErr) {
                  return done(aboutsGetErr);
                }

                // Get Abouts list
                var abouts = aboutsGetRes.body;

                // Set assertions
                (abouts[0].user._id).should.equal(userId);
                (abouts[0].name).should.match('About name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an About if not logged in', function (done) {
    agent.post('/api/abouts')
      .send(about)
      .expect(403)
      .end(function (aboutSaveErr, aboutSaveRes) {
        // Call the assertion callback
        done(aboutSaveErr);
      });
  });

  it('should not be able to save an About if no name is provided', function (done) {
    // Invalidate name field
    about.name = '';

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

        // Save a new About
        agent.post('/api/abouts')
          .send(about)
          .expect(400)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Set message assertion
            (aboutSaveRes.body.message).should.match('Please fill About name');

            // Handle About save error
            done(aboutSaveErr);
          });
      });
  });

  it('should be able to update an About if signed in', function (done) {
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

        // Save a new About
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle About save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Update About name
            about.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing About
            agent.put('/api/abouts/' + aboutSaveRes.body._id)
              .send(about)
              .expect(200)
              .end(function (aboutUpdateErr, aboutUpdateRes) {
                // Handle About update error
                if (aboutUpdateErr) {
                  return done(aboutUpdateErr);
                }

                // Set assertions
                (aboutUpdateRes.body._id).should.equal(aboutSaveRes.body._id);
                (aboutUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Abouts if not signed in', function (done) {
    // Create new About model instance
    var aboutObj = new About(about);

    // Save the about
    aboutObj.save(function () {
      // Request Abouts
      request(app).get('/api/abouts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single About if not signed in', function (done) {
    // Create new About model instance
    var aboutObj = new About(about);

    // Save the About
    aboutObj.save(function () {
      request(app).get('/api/abouts/' + aboutObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', about.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single About with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/abouts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'About is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single About which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent About
    request(app).get('/api/abouts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No About with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an About if signed in', function (done) {
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

        // Save a new About
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle About save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Delete an existing About
            agent.delete('/api/abouts/' + aboutSaveRes.body._id)
              .send(about)
              .expect(200)
              .end(function (aboutDeleteErr, aboutDeleteRes) {
                // Handle about error error
                if (aboutDeleteErr) {
                  return done(aboutDeleteErr);
                }

                // Set assertions
                (aboutDeleteRes.body._id).should.equal(aboutSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an About if not signed in', function (done) {
    // Set About user
    about.user = user;

    // Create new About model instance
    var aboutObj = new About(about);

    // Save the About
    aboutObj.save(function () {
      // Try deleting About
      request(app).delete('/api/abouts/' + aboutObj._id)
        .expect(403)
        .end(function (aboutDeleteErr, aboutDeleteRes) {
          // Set message assertion
          (aboutDeleteRes.body.message).should.match('User is not authorized');

          // Handle About error error
          done(aboutDeleteErr);
        });

    });
  });

  it('should be able to get a single About that has an orphaned user reference', function (done) {
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

          // Save a new About
          agent.post('/api/abouts')
            .send(about)
            .expect(200)
            .end(function (aboutSaveErr, aboutSaveRes) {
              // Handle About save error
              if (aboutSaveErr) {
                return done(aboutSaveErr);
              }

              // Set assertions on new About
              (aboutSaveRes.body.name).should.equal(about.name);
              should.exist(aboutSaveRes.body.user);
              should.equal(aboutSaveRes.body.user._id, orphanId);

              // force the About to have an orphaned user reference
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

                    // Get the About
                    agent.get('/api/abouts/' + aboutSaveRes.body._id)
                      .expect(200)
                      .end(function (aboutInfoErr, aboutInfoRes) {
                        // Handle About error
                        if (aboutInfoErr) {
                          return done(aboutInfoErr);
                        }

                        // Set assertions
                        (aboutInfoRes.body._id).should.equal(aboutSaveRes.body._id);
                        (aboutInfoRes.body.name).should.equal(about.name);
                        should.equal(aboutInfoRes.body.user, undefined);

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
      About.remove().exec(done);
    });
  });
});
