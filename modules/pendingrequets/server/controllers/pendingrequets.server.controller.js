'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Pendingrequet = mongoose.model('Pendingrequet'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    multer = require('multer'),
    config = require(path.resolve('./config/config')),
    fs = require('fs'),
    _ = require('lodash');


/**
 * Upload Image in Pendingrequet
 */
exports.uploadImage = function (req, res) {
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

    pendingrequet.imageURL = config.uploads.pendingProfileUpload.dest + pendingrequet.filename;

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

    pendingrequet.imageURL = config.uploads.pendingProfileUpload.dest + pendingrequet.filename;

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
