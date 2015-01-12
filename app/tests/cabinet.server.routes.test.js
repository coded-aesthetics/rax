'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cabinet = mongoose.model('Cabinet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cabinet;

/**
 * Cabinet routes tests
 */
describe('Cabinet CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Cabinet
		user.save(function() {
			cabinet = {
				name: 'Cabinet Name'
			};

			done();
		});
	});

	it('should be able to save Cabinet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cabinet
				agent.post('/cabinets')
					.send(cabinet)
					.expect(200)
					.end(function(cabinetSaveErr, cabinetSaveRes) {
						// Handle Cabinet save error
						if (cabinetSaveErr) done(cabinetSaveErr);

						// Get a list of Cabinets
						agent.get('/cabinets')
							.end(function(cabinetsGetErr, cabinetsGetRes) {
								// Handle Cabinet save error
								if (cabinetsGetErr) done(cabinetsGetErr);

								// Get Cabinets list
								var cabinets = cabinetsGetRes.body;

								// Set assertions
								(cabinets[0].user._id).should.equal(userId);
								(cabinets[0].name).should.match('Cabinet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cabinet instance if not logged in', function(done) {
		agent.post('/cabinets')
			.send(cabinet)
			.expect(401)
			.end(function(cabinetSaveErr, cabinetSaveRes) {
				// Call the assertion callback
				done(cabinetSaveErr);
			});
	});

	it('should not be able to save Cabinet instance if no name is provided', function(done) {
		// Invalidate name field
		cabinet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cabinet
				agent.post('/cabinets')
					.send(cabinet)
					.expect(400)
					.end(function(cabinetSaveErr, cabinetSaveRes) {
						// Set message assertion
						(cabinetSaveRes.body.message).should.match('Please fill Cabinet name');
						
						// Handle Cabinet save error
						done(cabinetSaveErr);
					});
			});
	});

	it('should be able to update Cabinet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cabinet
				agent.post('/cabinets')
					.send(cabinet)
					.expect(200)
					.end(function(cabinetSaveErr, cabinetSaveRes) {
						// Handle Cabinet save error
						if (cabinetSaveErr) done(cabinetSaveErr);

						// Update Cabinet name
						cabinet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cabinet
						agent.put('/cabinets/' + cabinetSaveRes.body._id)
							.send(cabinet)
							.expect(200)
							.end(function(cabinetUpdateErr, cabinetUpdateRes) {
								// Handle Cabinet update error
								if (cabinetUpdateErr) done(cabinetUpdateErr);

								// Set assertions
								(cabinetUpdateRes.body._id).should.equal(cabinetSaveRes.body._id);
								(cabinetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cabinets if not signed in', function(done) {
		// Create new Cabinet model instance
		var cabinetObj = new Cabinet(cabinet);

		// Save the Cabinet
		cabinetObj.save(function() {
			// Request Cabinets
			request(app).get('/cabinets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cabinet if not signed in', function(done) {
		// Create new Cabinet model instance
		var cabinetObj = new Cabinet(cabinet);

		// Save the Cabinet
		cabinetObj.save(function() {
			request(app).get('/cabinets/' + cabinetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cabinet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cabinet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cabinet
				agent.post('/cabinets')
					.send(cabinet)
					.expect(200)
					.end(function(cabinetSaveErr, cabinetSaveRes) {
						// Handle Cabinet save error
						if (cabinetSaveErr) done(cabinetSaveErr);

						// Delete existing Cabinet
						agent.delete('/cabinets/' + cabinetSaveRes.body._id)
							.send(cabinet)
							.expect(200)
							.end(function(cabinetDeleteErr, cabinetDeleteRes) {
								// Handle Cabinet error error
								if (cabinetDeleteErr) done(cabinetDeleteErr);

								// Set assertions
								(cabinetDeleteRes.body._id).should.equal(cabinetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cabinet instance if not signed in', function(done) {
		// Set Cabinet user 
		cabinet.user = user;

		// Create new Cabinet model instance
		var cabinetObj = new Cabinet(cabinet);

		// Save the Cabinet
		cabinetObj.save(function() {
			// Try deleting Cabinet
			request(app).delete('/cabinets/' + cabinetObj._id)
			.expect(401)
			.end(function(cabinetDeleteErr, cabinetDeleteRes) {
				// Set message assertion
				(cabinetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cabinet error error
				done(cabinetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cabinet.remove().exec();
		done();
	});
});