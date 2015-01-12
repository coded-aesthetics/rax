'use strict';

// Racks controller
angular.module('racks').controller('RacksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Racks',
	function($scope, $stateParams, $location, Authentication, Racks) {
		$scope.authentication = Authentication;

		// Create new Rack
		$scope.create = function() {
			// Create new Rack object
			var rack = new Racks ({
				name: this.name
			});

			// Redirect after save
			rack.$save(function(response) {
				$location.path('racks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rack
		$scope.remove = function(rack) {
			if ( rack ) { 
				rack.$remove();

				for (var i in $scope.racks) {
					if ($scope.racks [i] === rack) {
						$scope.racks.splice(i, 1);
					}
				}
			} else {
				$scope.rack.$remove(function() {
					$location.path('racks');
				});
			}
		};

		// Update existing Rack
		$scope.update = function() {
			var rack = $scope.rack;

			rack.$update(function() {
				$location.path('racks/' + rack._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Racks
		$scope.find = function() {
			$scope.racks = Racks.query();
		};

		// Find existing Rack
		$scope.findOne = function() {
			$scope.rack = Racks.get({ 
				rackId: $stateParams.rackId
			});
		};
	}
]);