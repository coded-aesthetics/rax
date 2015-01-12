'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cabinet = mongoose.model('Cabinet'),
	_ = require('lodash');

/**
 * Create a Cabinet
 */
exports.create = function(req, res) {
	var cabinet = new Cabinet(req.body);
	cabinet.user = req.user;

	cabinet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cabinet);
		}
	});
};

/**
 * Show the current Cabinet
 */
exports.read = function(req, res) {
	res.jsonp(req.cabinet);
};

/**
 * Update a Cabinet
 */
exports.update = function(req, res) {
	var cabinet = req.cabinet ;

	cabinet = _.extend(cabinet , req.body);

	cabinet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cabinet);
		}
	});
};

/**
 * Delete an Cabinet
 */
exports.delete = function(req, res) {
	var cabinet = req.cabinet ;

	cabinet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cabinet);
		}
	});
};

/**
 * List of Cabinets
 */
exports.list = function(req, res) { 
	Cabinet.find().sort('-created').populate('user', 'displayName').exec(function(err, cabinets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cabinets);
		}
	});
};

/**
 * Cabinet middleware
 */
exports.cabinetByID = function(req, res, next, id) { 
	Cabinet.findById(id).populate('user', 'displayName').exec(function(err, cabinet) {
		if (err) return next(err);
		if (! cabinet) return next(new Error('Failed to load Cabinet ' + id));
		req.cabinet = cabinet ;
		next();
	});
};

/**
 * Cabinet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cabinet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
