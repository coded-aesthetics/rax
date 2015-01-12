'use strict';

(function() {
	// Racks Controller Spec
	describe('Racks Controller Tests', function() {
		// Initialize global variables
		var RacksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Racks controller.
			RacksController = $controller('RacksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rack object fetched from XHR', inject(function(Racks) {
			// Create sample Rack using the Racks service
			var sampleRack = new Racks({
				name: 'New Rack'
			});

			// Create a sample Racks array that includes the new Rack
			var sampleRacks = [sampleRack];

			// Set GET response
			$httpBackend.expectGET('racks').respond(sampleRacks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.racks).toEqualData(sampleRacks);
		}));

		it('$scope.findOne() should create an array with one Rack object fetched from XHR using a rackId URL parameter', inject(function(Racks) {
			// Define a sample Rack object
			var sampleRack = new Racks({
				name: 'New Rack'
			});

			// Set the URL parameter
			$stateParams.rackId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/racks\/([0-9a-fA-F]{24})$/).respond(sampleRack);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rack).toEqualData(sampleRack);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Racks) {
			// Create a sample Rack object
			var sampleRackPostData = new Racks({
				name: 'New Rack'
			});

			// Create a sample Rack response
			var sampleRackResponse = new Racks({
				_id: '525cf20451979dea2c000001',
				name: 'New Rack'
			});

			// Fixture mock form input values
			scope.name = 'New Rack';

			// Set POST response
			$httpBackend.expectPOST('racks', sampleRackPostData).respond(sampleRackResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rack was created
			expect($location.path()).toBe('/racks/' + sampleRackResponse._id);
		}));

		it('$scope.update() should update a valid Rack', inject(function(Racks) {
			// Define a sample Rack put data
			var sampleRackPutData = new Racks({
				_id: '525cf20451979dea2c000001',
				name: 'New Rack'
			});

			// Mock Rack in scope
			scope.rack = sampleRackPutData;

			// Set PUT response
			$httpBackend.expectPUT(/racks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/racks/' + sampleRackPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rackId and remove the Rack from the scope', inject(function(Racks) {
			// Create new Rack object
			var sampleRack = new Racks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Racks array and include the Rack
			scope.racks = [sampleRack];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/racks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRack);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.racks.length).toBe(0);
		}));
	});
}());