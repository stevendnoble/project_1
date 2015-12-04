var request = require('request'),
		expect = require('chai').expect,
		baseUrl = 'http://localhost:3000';

describe('Users', function() {
	it('should show sign up page on GET /signup', function (done) {
		request(baseUrl + '/signup', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should show login page on GET /login', function (done) {
		request(baseUrl	+ '/login', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should show profile page on GET /profile', function (done) {
		request(baseUrl + '/profile', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should log out on GET /logout', function (done) {
		request(baseUrl + '/logout', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should have an index page on GET /', function (done) {
		request(baseUrl + '/', function (error, reponse, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should get route to show the favorited events as json on GET /api/favEvents', function (done) {
		request(baseUrl + '/api/favEvents', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
});
