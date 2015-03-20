// This is a message graph.

// A postObject has a significant charcter that splits the GUID from the postText.
// A value in the posts store is the post ID.

// postChildren DB keeps track of posts that are children of another post.
// Each entry points one postObject to another postObject; the key is the parent,
// and the value is the child.
// postChildren keys are in the form guid:beginingDelimiter:text:id

// The log keeps a record of all transactions. We use the length of the log to determine
// the next inserted record's ID.

var level = module.require('level');
var posts = level('./posts'); // edge pointing from guid to postObject
var postChildren = level('./postChildren'); // edge pointing from post to childPost
var log = level('./log');
var beginingDelimiter = '\u0000';
var endDelimiter = '\uffff';
var PutError = {};

// Initialize log so we can get its approximateSize
log.put(beginingDelimiter, 'log start');
log.put(endDelimiter, 'log end');

module.exports = {
    log: log,

    createPost: function  (guid, text, parentPostObject, callback) {
        // Creates a new post, giving it the next available ID.
        // If a parentPostObject is supplied, an entry will also be made
        // in the postChildren store.
        var postObject = guid + beginingDelimiter + text;

        var size = parseInt(log.db.getProperty('leveldb.num-files-at-level0'));
        if (size != 0) {
            var level1 = parseInt(log.db.getProperty('leveldb.num-files-at-level1'));
            size += level1;
        }
        if (level1 != 0) {
            var level2 = parseInt(log.db.getProperty('leveldb.num-files-at-level2'));
            size += level2;
        }
        if (level2 != 0) {
            var level3 = parseInt(log.db.getProperty('leveldb.num-files-at-level3'));
            size += level3;
        }
        if (level3 != 0) { 
            var level4 = parseInt(log.db.getProperty('leveldb.num-files-at-level4'));
            size += level4;
        }
        if (level4 != 0) {
            var level5 = parseInt(log.db.getProperty('leveldb.num-files-at-level5'));
            size += level5;
        }
        if (level5 != 0) {
            var level6 = parseInt(log.db.getProperty('leveldb.num-files-at-level6'));
            size += level6;
        }
        if (level6 != 0) {
            var level7 = parseInt(log.db.getProperty('leveldb.num-files-at-level7'));
            size += level7;
        }

        var postId = size + 1;
        console.log(postId);

        if (!parentPostObject) callback(postId);

        posts.put(postId, postObject, function (err) {
            if (err) return new Error("Failed to insert post record.");

            log.put('put-post', 'success', function (err) {
                if (err) return new Error("Failed to update the log");

                if (parentPostObject) {
                    log.put('put-post-child', 'success', function (err) {
                        if (err) return new Error("Failed to update the log.");

                        var parentNodeId = postId + 1;
                        var parentPostNodeObject = parentPostObject + parentNodeId;

                        postChildren.put(parentPostNodeObject, postObject, function (err) {
                            if (err) return new Error("Failed to insert parent-child record.");
                            callback([parentPostNodeObject, postObject]);
                        });
                      
                    });
                }             
            });
        });
    return true;
    },

    getPost: function (id, callback) {
        // Gets a post object and all of the associated child posts.
        posts.get(id, function (err, post) {
            if (err) throw new Error("Failed to get post.")
            var result = {
              post: post,
              postChildren: []
            }
            // postChildren keys are in the form guid:beginingDelimiter:text:id
            // we need to read through all the entries that match this specific post object.
            postChildren.createReadStream({gte: post + beginingDelimiter, lte: post + endDelimiter})
                .on('data', function (data) {
                    result.postChildren.push(data);
                })
                .on('error', function (err) {
                    return new Error("Failure when reading stream for postChildren.");
                })
                .on('end', function () {
                    callback(result);
                });
        });
    },

    deletePost: function (id, callback) {
        // Delete a post object by id.
        posts.del(id, function (err) {
            if (err) return new Error("Failed to delete post with id:" + id);
            callback(true);
        });
    }
}
