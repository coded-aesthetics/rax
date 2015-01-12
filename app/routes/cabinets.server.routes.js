'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cabinets = require('../../app/controllers/cabinets.server.controller');

	// Cabinets Routes
	app.route('/cabinets')
		.get(cabinets.list)
		.post(users.requiresLogin, cabinets.create);

	app.route('/cabinets/:cabinetId')
		.get(cabinets.read)
		.put(users.requiresLogin, cabinets.hasAuthorization, cabinets.update)
		.delete(users.requiresLogin, cabinets.hasAuthorization, cabinets.delete);

	// Finish by binding the Cabinet middleware
	app.param('cabinetId', cabinets.cabinetByID);
};
