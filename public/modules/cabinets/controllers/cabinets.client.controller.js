'use strict';

// Cabinets controller
angular.module('cabinets').controller('CabinetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cabinets',
	function($scope, $stateParams, $location, Authentication, Cabinets) {
		$scope.authentication = Authentication;

		// Create new Cabinet
		$scope.create = function() {
			// Create new Cabinet object
			var cabinet = new Cabinets ({
				name: this.name
			});

			// Redirect after save
			cabinet.$save(function(response) {
				$location.path('cabinets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cabinet
		$scope.remove = function(cabinet) {
			if ( cabinet ) { 
				cabinet.$remove();

				for (var i in $scope.cabinets) {
					if ($scope.cabinets [i] === cabinet) {
						$scope.cabinets.splice(i, 1);
					}
				}
			} else {
				$scope.cabinet.$remove(function() {
					$location.path('cabinets');
				});
			}
		};

		// Update existing Cabinet
		$scope.update = function() {
			var cabinet = $scope.cabinet;

			cabinet.$update(function() {
				$location.path('cabinets/' + cabinet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cabinets
		$scope.find = function() {
			$scope.cabinets = Cabinets.query();
		};

		// Find existing Cabinet
		$scope.findOne = function() {
			$scope.cabinet = Cabinets.get({ 
				cabinetId: $stateParams.cabinetId
			});
		};
	}
]);