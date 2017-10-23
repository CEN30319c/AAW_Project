'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Test = mongoose.model('Test'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  test;

/**
 * Test routes tests
 */
describe('Test CRUD tests', function () {

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

    // Save a user to the test db and create new Test
    user.save(function () {
      test = {
        name: 'Test name'
      };

      done();
    });
  });

  it('should be able to save a Test if logged in', function (done) {
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

        // Save a new Test
        agent.post('/api/tests')
          .send(test)
          .expect(200)
          .end(function (testSaveErr, testSaveRes) {
            // Handle Test save error
            if (testSaveErr) {
              return done(testSaveErr);
            }

            // Get a list of Tests
            agent.get('/api/tests')
              .end(function (testsGetErr, testsGetRes) {
                // Handle Tests save error
                if (testsGetErr) {
                  return done(testsGetErr);
                }

                // Get Tests list
                var tests = testsGetRes.body;

                // Set assertions
                (tests[0].user._id).should.equal(userId);
                (tests[0].name).should.match('Test name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Test if not logged in', function (done) {
    agent.post('/api/tests')
      .send(test)
      .expect(403)
      .end(function (testSaveErr, testSaveRes) {
        // Call the assertion callback
        done(testSaveErr);
      });
  });

  it('should not be able to save an Test if no name is provided', function (done) {
    // Invalidate name field
    test.name = '';

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

        // Save a new Test
        agent.post('/api/tests')
          .send(test)
          .expect(400)
          .end(function (testSaveErr, testSaveRes) {
            // Set message assertion
            (testSaveRes.body.message).should.match('Please fill Test name');

            // Handle Test save error
            done(testSaveErr);
          });
      });
  });

  it('should be able to update an Test if signed in', function (done) {
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

        // Save a new Test
        agent.post('/api/tests')
          .send(test)
          .expect(200)
          .end(function (testSaveErr, testSaveRes) {
            // Handle Test save error
            if (testSaveErr) {
              return done(testSaveErr);
            }

            // Update Test name
            test.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Test
            agent.put('/api/tests/' + testSaveRes.body._id)
              .send(test)
              .expect(200)
              .end(function (testUpdateErr, testUpdateRes) {
                // Handle Test update error
                if (testUpdateErr) {
                  return done(testUpdateErr);
                }

                // Set assertions
                (testUpdateRes.body._id).should.equal(testSaveRes.body._id);
                (testUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tests if not signed in', function (done) {
    // Create new Test model instance
    var testObj = new Test(test);

    // Save the test
    testObj.save(function () {
      // Request Tests
      request(app).get('/api/tests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Test if not signed in', function (done) {
    // Create new Test model instance
    var testObj = new Test(test);

    // Save the Test
    testObj.save(function () {
      request(app).get('/api/tests/' + testObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', test.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Test with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Test is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Test which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Test
    request(app).get('/api/tests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Test with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Test if signed in', function (done) {
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

        // Save a new Test
        agent.post('/api/tests')
          .send(test)
          .expect(200)
          .end(function (testSaveErr, testSaveRes) {
            // Handle Test save error
            if (testSaveErr) {
              return done(testSaveErr);
            }

            // Delete an existing Test
            agent.delete('/api/tests/' + testSaveRes.body._id)
              .send(test)
              .expect(200)
              .end(function (testDeleteErr, testDeleteRes) {
                // Handle test error error
                if (testDeleteErr) {
                  return done(testDeleteErr);
                }

                // Set assertions
                (testDeleteRes.body._id).should.equal(testSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Test if not signed in', function (done) {
    // Set Test user
    test.user = user;

    // Create new Test model instance
    var testObj = new Test(test);

    // Save the Test
    testObj.save(function () {
      // Try deleting Test
      request(app).delete('/api/tests/' + testObj._id)
        .expect(403)
        .end(function (testDeleteErr, testDeleteRes) {
          // Set message assertion
          (testDeleteRes.body.message).should.match('User is not authorized');

          // Handle Test error error
          done(testDeleteErr);
        });

    });
  });

  it('should be able to get a single Test that has an orphaned user reference', function (done) {
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

          // Save a new Test
          agent.post('/api/tests')
            .send(test)
            .expect(200)
            .end(function (testSaveErr, testSaveRes) {
              // Handle Test save error
              if (testSaveErr) {
                return done(testSaveErr);
              }

              // Set assertions on new Test
              (testSaveRes.body.name).should.equal(test.name);
              should.exist(testSaveRes.body.user);
              should.equal(testSaveRes.body.user._id, orphanId);

              // force the Test to have an orphaned user reference
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

                    // Get the Test
                    agent.get('/api/tests/' + testSaveRes.body._id)
                      .expect(200)
                      .end(function (testInfoErr, testInfoRes) {
                        // Handle Test error
                        if (testInfoErr) {
                          return done(testInfoErr);
                        }

                        // Set assertions
                        (testInfoRes.body._id).should.equal(testSaveRes.body._id);
                        (testInfoRes.body.name).should.equal(test.name);
                        should.equal(testInfoRes.body.user, undefined);

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
      Test.remove().exec(done);
    });
  });
});
