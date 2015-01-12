'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rack = mongoose.model('Rack'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rack;

/**
 * Rack routes tests
 */
describe('Rack CRUD tests', function() {
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

		// Save a user to the test db and create new Rack
		user.save(function() {
			rack = {
				name: 'Rack Name'
			};

			done();
		});
	});

	it('should be able to save Rack instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rack
				agent.post('/racks')
					.send(rack)
					.expect(200)
					.end(function(rackSaveErr, rackSaveRes) {
						// Handle Rack save error
						if (rackSaveErr) done(rackSaveErr);

						// Get a list of Racks
						agent.get('/racks')
							.end(function(racksGetErr, racksGetRes) {
								// Handle Rack save error
								if (racksGetErr) done(racksGetErr);

								// Get Racks list
								var racks = racksGetRes.body;

								// Set assertions
								(racks[0].user._id).should.equal(userId);
								(racks[0].name).should.match('Rack Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rack instance if not logged in', function(done) {
		agent.post('/racks')
			.send(rack)
			.expect(401)
			.end(function(rackSaveErr, rackSaveRes) {
				// Call the assertion callback
				done(rackSaveErr);
			});
	});

	it('should not be able to save Rack instance if no name is provided', function(done) {
		// Invalidate name field
		rack.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rack
				agent.post('/racks')
					.send(rack)
					.expect(400)
					.end(function(rackSaveErr, rackSaveRes) {
						// Set message assertion
						(rackSaveRes.body.message).should.match('Please fill Rack name');
						
						// Handle Rack save error
						done(rackSaveErr);
					});
			});
	});

	it('should be able to update Rack instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rack
				agent.post('/racks')
					.send(rack)
					.expect(200)
					.end(function(rackSaveErr, rackSaveRes) {
						// Handle Rack save error
						if (rackSaveErr) done(rackSaveErr);

						// Update Rack name
						rack.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rack
						agent.put('/racks/' + rackSaveRes.body._id)
							.send(rack)
							.expect(200)
							.end(function(rackUpdateErr, rackUpdateRes) {
								// Handle Rack update error
								if (rackUpdateErr) done(rackUpdateErr);

								// Set assertions
								(rackUpdateRes.body._id).should.equal(rackSaveRes.body._id);
								(rackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Racks if not signed in', function(done) {
		// Create new Rack model instance
		var rackObj = new Rack(rack);

		// Save the Rack
		rackObj.save(function() {
			// Request Racks
			request(app).get('/racks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rack if not signed in', function(done) {
		// Create new Rack model instance
		var rackObj = new Rack(rack);

		// Save the Rack
		rackObj.save(function() {
			request(app).get('/racks/' + rackObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rack.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rack instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rack
				agent.post('/racks')
					.send(rack)
					.expect(200)
					.end(function(rackSaveErr, rackSaveRes) {
						// Handle Rack save error
						if (rackSaveErr) done(rackSaveErr);

						// Delete existing Rack
						agent.delete('/racks/' + rackSaveRes.body._id)
							.send(rack)
							.expect(200)
							.end(function(rackDeleteErr, rackDeleteRes) {
								// Handle Rack error error
								if (rackDeleteErr) done(rackDeleteErr);

								// Set assertions
								(rackDeleteRes.body._id).should.equal(rackSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rack instance if not signed in', function(done) {
		// Set Rack user 
		rack.user = user;

		// Create new Rack model instance
		var rackObj = new Rack(rack);

		// Save the Rack
		rackObj.save(function() {
			// Try deleting Rack
			request(app).delete('/racks/' + rackObj._id)
			.expect(401)
			.end(function(rackDeleteErr, rackDeleteRes) {
				// Set message assertion
				(rackDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rack error error
				done(rackDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rack.remove().exec();
		done();
	});
});