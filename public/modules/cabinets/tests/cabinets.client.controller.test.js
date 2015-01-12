'use strict';

(function() {
	// Cabinets Controller Spec
	describe('Cabinets Controller Tests', function() {
		// Initialize global variables
		var CabinetsController,
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

			// Initialize the Cabinets controller.
			CabinetsController = $controller('CabinetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cabinet object fetched from XHR', inject(function(Cabinets) {
			// Create sample Cabinet using the Cabinets service
			var sampleCabinet = new Cabinets({
				name: 'New Cabinet'
			});

			// Create a sample Cabinets array that includes the new Cabinet
			var sampleCabinets = [sampleCabinet];

			// Set GET response
			$httpBackend.expectGET('cabinets').respond(sampleCabinets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cabinets).toEqualData(sampleCabinets);
		}));

		it('$scope.findOne() should create an array with one Cabinet object fetched from XHR using a cabinetId URL parameter', inject(function(Cabinets) {
			// Define a sample Cabinet object
			var sampleCabinet = new Cabinets({
				name: 'New Cabinet'
			});

			// Set the URL parameter
			$stateParams.cabinetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cabinets\/([0-9a-fA-F]{24})$/).respond(sampleCabinet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cabinet).toEqualData(sampleCabinet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cabinets) {
			// Create a sample Cabinet object
			var sampleCabinetPostData = new Cabinets({
				name: 'New Cabinet'
			});

			// Create a sample Cabinet response
			var sampleCabinetResponse = new Cabinets({
				_id: '525cf20451979dea2c000001',
				name: 'New Cabinet'
			});

			// Fixture mock form input values
			scope.name = 'New Cabinet';

			// Set POST response
			$httpBackend.expectPOST('cabinets', sampleCabinetPostData).respond(sampleCabinetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cabinet was created
			expect($location.path()).toBe('/cabinets/' + sampleCabinetResponse._id);
		}));

		it('$scope.update() should update a valid Cabinet', inject(function(Cabinets) {
			// Define a sample Cabinet put data
			var sampleCabinetPutData = new Cabinets({
				_id: '525cf20451979dea2c000001',
				name: 'New Cabinet'
			});

			// Mock Cabinet in scope
			scope.cabinet = sampleCabinetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cabinets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cabinets/' + sampleCabinetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cabinetId and remove the Cabinet from the scope', inject(function(Cabinets) {
			// Create new Cabinet object
			var sampleCabinet = new Cabinets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cabinets array and include the Cabinet
			scope.cabinets = [sampleCabinet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cabinets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCabinet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cabinets.length).toBe(0);
		}));
	});
}());