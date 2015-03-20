var assert = require('assert');
var graph = require('../bin/graph.js');

describe('creating a single post without children, get it, then delete it.', function () {
    it('should be able to create a post', function (done) {
        graph.createPost('123', 'test post', null, function (value) {
            assert.equal(1, value);
            done();
        });
    });

    it('should be able to get a post', function (done) {
        graph.getPost('1', function (value) {
            assert.equal(value.post, '123' + '\u0000' + 'test post');
            assert.equal(value.postChildren.length, 0);
            done();
        });
    });

    it('should be able to delete a post', function (done) {
        graph.deletePost('1', function (res) {
            assert.equal(res, true);
            done();
        });
    });
});

describe('create a single post with children, get it, then delete it.', function () {
    it('should create the parent', function (done) {
        graph.createPost('456', 'parent', null, function(value) {
            assert.equal(value, 1);
            done();
        });
    });

    it('should be able to create a childPost', function (done) {
        graph.createPost('123', 'test post', '456\u0000parent', function (value) {
            assert.equal(['456\u0000parent0', '123\u0000test post'][0], value[0]);
            assert.equal(['456\u0000parent0', '123\u0000test post'][1], value[1]);
            done();
        });
    });

    it('should be able to create anotehr childPost', function (done) {
        graph.createPost('123', 'test post2', '456\u0000parent', function (value) {
            assert.equal(['456\u0000parent1', '123\u0000test post2'][0], value[0]);
            assert.equal(['456\u0000parent1', '123\u0000test post2'][1], value[1]);
            done();
        });
    });

});
