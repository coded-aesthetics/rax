'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms',
	function($scope, $stateParams, $location, Authentication, Rooms) {
		$scope.authentication = Authentication;

		// Create new Room
		$scope.create = function() {
			// Create new Room object
			var room = new Rooms ({
				name: this.name,
                size: {width:this.width, height:this.height},
                cabinets: [
                    {
                        id: 0,
                        name: 'Cabinet 0',
                        pos: {
                            x: 10,
                            y: 10
                        },
                        size: {
                            width:100,
                            height:20
                        },
                        racks: [
                            {
                                id:0,
                                slots: [
                                    {
                                        isUsed: true,
                                        ip: '192.168.0.212'
                                    },{
                                        isUsed: false,
                                        ip: '192.168.0.212'
                                    },{
                                        isUsed: true,
                                        ip: '192.168.1.112'
                                    },{
                                        isUsed: true,
                                        ip: '192.168.4.23'
                                    }
                                ]
                            },
                            {
                                id:1,
                                slots: [
                                    {
                                        isUsed: false,
                                        ip: '192.168.1.212'
                                    },{
                                        isUsed: true,
                                        ip: '192.168.0.333'
                                    },{
                                        isUsed: true,
                                        ip: '192.168.1.1'
                                    },{
                                        isUsed: false,
                                        ip: '192.168.4.23'
                                    }
                                ]
                            }
                        ]
                    }
                ]
			});

			// Redirect after save
			room.$save(function(response) {
				$location.path('rooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Room
		$scope.remove = function(room) {
			if ( room ) { 
				room.$remove();

				for (var i in $scope.rooms) {
					if ($scope.rooms [i] === room) {
						$scope.rooms.splice(i, 1);
					}
				}
			} else {
				$scope.room.$remove(function() {
					$location.path('rooms');
				});
			}
		};

		// Update existing Room
		$scope.update = function() {
			var room = $scope.room;

			room.$update(function() {
				$location.path('rooms/' + room._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rooms
		$scope.find = function() {
			$scope.rooms = Rooms.query();
		};

		// Find existing Room
		$scope.findOne = function() {
			$scope.room = Rooms.get({ 
				roomId: $stateParams.roomId
			});
		};
	}
]);