'use strict';

//Setting up route
angular.module('racks').config(['$stateProvider',
	function($stateProvider) {
		// Racks state routing
		$stateProvider.
		state('listRacks', {
			url: '/racks',
			templateUrl: 'modules/racks/views/list-racks.client.view.html'
		}).
		state('createRack', {
			url: '/racks/create',
			templateUrl: 'modules/racks/views/create-rack.client.view.html'
		}).
		state('viewRack', {
			url: '/racks/:rackId',
			templateUrl: 'modules/racks/views/view-rack.client.view.html'
		}).
		state('editRack', {
			url: '/racks/:rackId/edit',
			templateUrl: 'modules/racks/views/edit-rack.client.view.html'
		});
	}
]);