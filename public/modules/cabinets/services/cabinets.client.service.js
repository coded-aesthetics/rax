'use strict';

//Cabinets service used to communicate Cabinets REST endpoints
angular.module('cabinets').factory('Cabinets', ['$resource',
	function($resource) {
		return $resource('cabinets/:cabinetId', { cabinetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);