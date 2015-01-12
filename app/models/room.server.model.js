'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
    name: {
      type: String,
      required:true
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
    cabinets: [
        {
            id:Number,
            name:String,
            pos: {
                x: Number,
                y: Number
            },
            size: {
                width:Number,
                height:Number
            },
            racks: [
                {
                    id:Number,
                    slots: [
                        {
                            isUsed: Boolean,
                            ip: String
                        }]
                }
            ]
        }
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

mongoose.model('Room', RoomSchema);