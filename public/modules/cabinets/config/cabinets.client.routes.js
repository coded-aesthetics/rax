'use strict';

//Setting up route
angular.module('cabinets').config(['$stateProvider',
	function($stateProvider) {
		// Cabinets state routing
		$stateProvider.
		state('listCabinets', {
			url: '/cabinets',
			templateUrl: 'modules/cabinets/views/list-cabinets.client.view.html'
		}).
		state('createCabinet', {
			url: '/cabinets/create',
			templateUrl: 'modules/cabinets/views/create-cabinet.client.view.html'
		}).
		state('viewCabinet', {
			url: '/cabinets/:cabinetId',
			templateUrl: 'modules/cabinets/views/view-cabinet.client.view.html'
		}).
		state('editCabinet', {
			url: '/cabinets/:cabinetId/edit',
			templateUrl: 'modules/cabinets/views/edit-cabinet.client.view.html'
		});
	}
]);