var expect = require("chai").expect
var sinon = require("sinon");
var mockery = require("mockery");
var server = require("../server.js");

describe('server', function() {

    after(function() {
        mockery.disable(); // Disable Mockery after tests are completed
    });

    describe('push', function() {
    });
});
