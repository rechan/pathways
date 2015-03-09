var expect = require("chai").expect
var sinon = require("sinon");
var mockery = require("mockery");
var request = require("request");
var server = require("../bin/server.js");

describe('server', function() {

    before(function() {
        server.listen(8080);
    });

    after(function() {
        mockery.disable(); // Disable Mockery after tests are completed
        server.close();
    });

    it('should get the index', function(done) {
        request.get('http://localhost:8080', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal('I am here to mock out the index.html for testing.\n');
            done();
        });
    });
});
