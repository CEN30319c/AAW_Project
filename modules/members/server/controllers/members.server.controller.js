'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  multer = require('multer'),
  aws = require('aws-sdk'),
  config = require(path.resolve('./config/config')),
  fs = require('fs'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


  exports.uploadImage = function (req, res) {
    aws.config.loadFromPath('./s3_config.json');
    var S3_BUCKET = 'aawufimages';

    var s3 = new aws.S3();

    var fileName = req.query['file-name'];
    var fileType = req.query['file-type'];
    //var path = fileName;

    var s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ACL: 'public-read',
      ContentType: fileType
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err) {
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
};

  exports.uploadImageDB = function (req, res) {
    var message = null;

    var upload = multer(config.uploads.pendingProfileUpload).single('newMemberPicture');
    var membersUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;


    // Filtering to upload only images
    upload.fileFilter = membersUploadFileFilter;

    upload(req, res, function (uploadError) {
        if (uploadError) {
            return res.status(400).send({
                message: 'Error occurred while uploading upcoming member picture'
            });
        }
        else {
            return res.status(200).send({
                message: 'Is working!',
                file: req.file
            });
        }
    });
};


/**
 * Create a Member
 */
exports.create = function(req, res) {
  var member = new Member(req.body);
  member.user = req.user;
  member.imageURL = 'https://s3.us-east-2.amazonaws.com/aawufimages/' + member.filename;

  member.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * Show the current Member
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var member = req.member ? req.member.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  member.isCurrentUserOwner = req.user && member.user && member.user._id.toString() === req.user._id.toString();

  res.jsonp(member);
};

/**
 * Update a Member
 */
exports.update = function(req, res) {
  var member = req.member;

  member = _.extend(member, req.body);

  member.imageURL = 'https://s3.us-east-2.amazonaws.com/aawufimages/' + member.filename;

  member.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * Delete an Member
 */
exports.delete = function(req, res) {
  var member = req.member;

  member.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * List of Members
 */
exports.list = function(req, res) {
  Member.find().sort('-created').populate('user', 'displayName').exec(function(err, members) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

/**
 * Member middleware
 */
exports.memberByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Member is invalid'
    });
  }

  Member.findById(id).populate('user', 'displayName').exec(function (err, member) {
    if (err) {
      return next(err);
    } else if (!member) {
      return res.status(404).send({
        message: 'No Member with that identifier has been found'
      });
    }
    req.member = member;
    next();
  });
};
