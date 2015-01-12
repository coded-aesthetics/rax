'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var racks = require('../../app/controllers/racks.server.controller');

	// Racks Routes
	app.route('/racks')
		.get(racks.list)
		.post(users.requiresLogin, racks.create);

	app.route('/racks/:rackId')
		.get(racks.read)
		.put(users.requiresLogin, racks.hasAuthorization, racks.update)
		.delete(users.requiresLogin, racks.hasAuthorization, racks.delete);

	// Finish by binding the Rack middleware
	app.param('rackId', racks.rackByID);
};
