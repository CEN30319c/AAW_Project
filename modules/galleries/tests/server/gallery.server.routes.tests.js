'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gallery = mongoose.model('Gallery'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  gallery;

/**
 * Gallery routes tests
 */
describe('Gallery CRUD tests', function () {

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

    // Save a user to the test db and create new Gallery
    user.save(function () {
      gallery = {
        name: 'Gallery name'
      };

      done();
    });
  });

  it('should be able to save a Gallery if logged in', function (done) {
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

        // Save a new Gallery
        agent.post('/api/galleries')
          .send(gallery)
          .expect(200)
          .end(function (gallerySaveErr, gallerySaveRes) {
            // Handle Gallery save error
            if (gallerySaveErr) {
              return done(gallerySaveErr);
            }

            // Get a list of Galleries
            agent.get('/api/galleries')
              .end(function (galleriesGetErr, galleriesGetRes) {
                // Handle Galleries save error
                if (galleriesGetErr) {
                  return done(galleriesGetErr);
                }

                // Get Galleries list
                var galleries = galleriesGetRes.body;

                // Set assertions
                (galleries[0].user._id).should.equal(userId);
                (galleries[0].name).should.match('Gallery name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Gallery if not logged in', function (done) {
    agent.post('/api/galleries')
      .send(gallery)
      .expect(403)
      .end(function (gallerySaveErr, gallerySaveRes) {
        // Call the assertion callback
        done(gallerySaveErr);
      });
  });

  it('should not be able to save an Gallery if no name is provided', function (done) {
    // Invalidate name field
    gallery.name = '';

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

        // Save a new Gallery
        agent.post('/api/galleries')
          .send(gallery)
          .expect(400)
          .end(function (gallerySaveErr, gallerySaveRes) {
            // Set message assertion
            (gallerySaveRes.body.message).should.match('Please fill Gallery name');

            // Handle Gallery save error
            done(gallerySaveErr);
          });
      });
  });

  it('should be able to update an Gallery if signed in', function (done) {
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

        // Save a new Gallery
        agent.post('/api/galleries')
          .send(gallery)
          .expect(200)
          .end(function (gallerySaveErr, gallerySaveRes) {
            // Handle Gallery save error
            if (gallerySaveErr) {
              return done(gallerySaveErr);
            }

            // Update Gallery name
            gallery.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Gallery
            agent.put('/api/galleries/' + gallerySaveRes.body._id)
              .send(gallery)
              .expect(200)
              .end(function (galleryUpdateErr, galleryUpdateRes) {
                // Handle Gallery update error
                if (galleryUpdateErr) {
                  return done(galleryUpdateErr);
                }

                // Set assertions
                (galleryUpdateRes.body._id).should.equal(gallerySaveRes.body._id);
                (galleryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Galleries if not signed in', function (done) {
    // Create new Gallery model instance
    var galleryObj = new Gallery(gallery);

    // Save the gallery
    galleryObj.save(function () {
      // Request Galleries
      request(app).get('/api/galleries')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Gallery if not signed in', function (done) {
    // Create new Gallery model instance
    var galleryObj = new Gallery(gallery);

    // Save the Gallery
    galleryObj.save(function () {
      request(app).get('/api/galleries/' + galleryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', gallery.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Gallery with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/galleries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Gallery is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Gallery which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Gallery
    request(app).get('/api/galleries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Gallery with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Gallery if signed in', function (done) {
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

        // Save a new Gallery
        agent.post('/api/galleries')
          .send(gallery)
          .expect(200)
          .end(function (gallerySaveErr, gallerySaveRes) {
            // Handle Gallery save error
            if (gallerySaveErr) {
              return done(gallerySaveErr);
            }

            // Delete an existing Gallery
            agent.delete('/api/galleries/' + gallerySaveRes.body._id)
              .send(gallery)
              .expect(200)
              .end(function (galleryDeleteErr, galleryDeleteRes) {
                // Handle gallery error error
                if (galleryDeleteErr) {
                  return done(galleryDeleteErr);
                }

                // Set assertions
                (galleryDeleteRes.body._id).should.equal(gallerySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Gallery if not signed in', function (done) {
    // Set Gallery user
    gallery.user = user;

    // Create new Gallery model instance
    var galleryObj = new Gallery(gallery);

    // Save the Gallery
    galleryObj.save(function () {
      // Try deleting Gallery
      request(app).delete('/api/galleries/' + galleryObj._id)
        .expect(403)
        .end(function (galleryDeleteErr, galleryDeleteRes) {
          // Set message assertion
          (galleryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Gallery error error
          done(galleryDeleteErr);
        });

    });
  });

  it('should be able to get a single Gallery that has an orphaned user reference', function (done) {
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

          // Save a new Gallery
          agent.post('/api/galleries')
            .send(gallery)
            .expect(200)
            .end(function (gallerySaveErr, gallerySaveRes) {
              // Handle Gallery save error
              if (gallerySaveErr) {
                return done(gallerySaveErr);
              }

              // Set assertions on new Gallery
              (gallerySaveRes.body.name).should.equal(gallery.name);
              should.exist(gallerySaveRes.body.user);
              should.equal(gallerySaveRes.body.user._id, orphanId);

              // force the Gallery to have an orphaned user reference
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

                    // Get the Gallery
                    agent.get('/api/galleries/' + gallerySaveRes.body._id)
                      .expect(200)
                      .end(function (galleryInfoErr, galleryInfoRes) {
                        // Handle Gallery error
                        if (galleryInfoErr) {
                          return done(galleryInfoErr);
                        }

                        // Set assertions
                        (galleryInfoRes.body._id).should.equal(gallerySaveRes.body._id);
                        (galleryInfoRes.body.name).should.equal(gallery.name);
                        should.equal(galleryInfoRes.body.user, undefined);

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
      Gallery.remove().exec(done);
    });
  });
});
