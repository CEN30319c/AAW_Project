'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Pendingrequet = mongoose.model('Pendingrequet'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    multer = require('multer'),
    aws = require('aws-sdk'),
    config = require(path.resolve('./config/config')),
    fs = require('fs'),
    _ = require('lodash');


/**
 * Upload Image in Pendingrequet
 */
exports.uploadImage = function (req, res) {
    aws.config.region = 'us-east-2';
    var S3_BUCKET = process.env.S3_BUCKET;

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

/**
 * Upload Image to MongoDB in Pendingrequet
 */
exports.uploadImageDB = function (req, res) {
  var message = null;

  var upload = multer(config.uploads.pendingProfileUpload).single('newMemberPicture');
  var pendingrequetsUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;


  // Filtering to upload only images
  upload.fileFilter = pendingrequetsUploadFileFilter;

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
 * Create a Pendingrequet
 */
exports.create = function (req, res) {
    var pendingrequet = new Pendingrequet(req.body);
    pendingrequet.user = req.user;

    if (pendingrequet.filename.substring(0, 5) === 'https') {
        pendingrequet.imageURL = pendingrequet.filename;
    } else {
        pendingrequet.imageURL = 'https://s3.us-east-2.amazonaws.com/aawufimages/' + pendingrequet.filename;
    }

    pendingrequet.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pendingrequet);
        }
    });
};

/**
 * Show the current Pendingrequet
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var pendingrequet = req.pendingrequet ? req.pendingrequet.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    pendingrequet.isCurrentUserOwner = req.user && pendingrequet.user && pendingrequet.user._id.toString() === req.user._id.toString();

    res.jsonp(pendingrequet);
};

/**
 * Update a Pendingrequet
 */
exports.update = function (req, res) {
    var pendingrequet = req.pendingrequet;

    pendingrequet = _.extend(pendingrequet, req.body);

    //pendingrequet.imageURL = config.uploads.pendingProfileUpload.dest + pendingrequet.filename;
    // pendingrequet.imageURL = 'https://s3.us-east-2.amazonaws.com/aawufimages/' + pendingrequet.filename;
    if (pendingrequet.filename.substring(0, 5) === 'https') {
        pendingrequet.imageURL = pendingrequet.filename;
    } else {
        pendingrequet.imageURL = 'https://s3.us-east-2.amazonaws.com/aawufimages/' + pendingrequet.filename;
    }


    pendingrequet.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pendingrequet);
        }
    });
};

/**
 * Delete an Pendingrequet
 */
exports.delete = function (req, res) {
    var pendingrequet = req.pendingrequet;

    pendingrequet.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pendingrequet);
        }
    });
};

/**
 * List of Pendingrequets
 */
exports.list = function (req, res) {
    Pendingrequet.find().sort('-created').populate('user', 'displayName').exec(function (err, pendingrequets) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pendingrequets);
        }
    });
};

/**
 * Pendingrequet middleware
 */
exports.pendingrequetByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Pendingrequet is invalid'
        });
    }

    Pendingrequet.findById(id).populate('user', 'displayName').exec(function (err, pendingrequet) {
        if (err) {
            return next(err);
        } else if (!pendingrequet) {
            return res.status(404).send({
                message: 'No Pendingrequet with that identifier has been found'
            });
        }
        req.pendingrequet = pendingrequet;
        next();
    });

};

/**
 * Sending email to notify admin. Authenticate email address.
 */
var nodemailer = require ('nodemailer');
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aaw.uf@outlook.com',
        pass: 'aaw@uf12345!'
    }
});

exports.sendMail = function (req, res) {
    var data = req.body;

    transport.sendMail({
        from: data.contactEmail,
        to: 'aaw.uf@outlook.com',
        subject: data.contactName + ' submitted a new Membership Application',
        text: data.contactMsg

    });
    res.json(data);
};


