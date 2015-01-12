'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cabinet Schema
 */
var CabinetSchema = new Schema({
    pos: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        }
    },
    size: {
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        }
    },
    racks: [
        {type: Schema.Types.ObjectId, ref: 'Rack'}
    ],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Cabinet', CabinetSchema);