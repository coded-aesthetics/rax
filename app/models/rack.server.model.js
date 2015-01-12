'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rack Schema
 */
var RackSchema = new Schema({
	ip: {
		type: String,
		default: '',
		required: 'Please provide Rack ip adress',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rack', RackSchema);