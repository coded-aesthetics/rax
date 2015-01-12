'use strict';

//Racks service used to communicate Racks REST endpoints
angular.module('racks').factory('Racks', ['$resource',
	function($resource) {
		return $resource('racks/:rackId', { rackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);