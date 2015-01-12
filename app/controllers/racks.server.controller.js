'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rack = mongoose.model('Rack'),
	_ = require('lodash');

/**
 * Create a Rack
 */
exports.create = function(req, res) {
	var rack = new Rack(req.body);
	rack.user = req.user;

	rack.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rack);
		}
	});
};

/**
 * Show the current Rack
 */
exports.read = function(req, res) {
	res.jsonp(req.rack);
};

/**
 * Update a Rack
 */
exports.update = function(req, res) {
	var rack = req.rack ;

	rack = _.extend(rack , req.body);

	rack.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rack);
		}
	});
};

/**
 * Delete an Rack
 */
exports.delete = function(req, res) {
	var rack = req.rack ;

	rack.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rack);
		}
	});
};

/**
 * List of Racks
 */
exports.list = function(req, res) { 
	Rack.find().sort('-created').populate('user', 'displayName').exec(function(err, racks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(racks);
		}
	});
};

/**
 * Rack middleware
 */
exports.rackByID = function(req, res, next, id) { 
	Rack.findById(id).populate('user', 'displayName').exec(function(err, rack) {
		if (err) return next(err);
		if (! rack) return next(new Error('Failed to load Rack ' + id));
		req.rack = rack ;
		next();
	});
};

/**
 * Rack authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rack.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
