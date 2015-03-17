var app = module.exports = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(app);
var hereGuids = fs.readdirSync(__dirname + '/../guids/here'); // This user's guids
var cp = require('child_process');
var level = require('level');
var crypto = require('crypto');
var API_BASE_URL = 'http://localhost:8080/';
//var sockets = require('./sockets/text.js')(io); 

var guidDb = level('./guids');
app.listen(8080);

function createGuid () {
    return crypto.randomBytes(20).toString('hex');
}

function storeGuid (guid, nick) {
    // Store a unique nick with a supplied GUID as the value.
    guidDb.get(nick, function (err, value) {
        if (err) {
            guidDb.put(nick, guid, function (err) {
                if (err) return console.log('Error placing key/value in db.', err);
            });
        } else {
            return console.log('Nick for guid exists.');
        }
    });
}

function findGuid (nick, res) {
    // Find a GUID and write it to a response.
    guidDb.get(nick, function (err, value) {
        if (err) return console.log('Nick not found.');
        res.end(
           JSON.stringify({guid: value}) 
        );
        return true;
    });
}

function handler (req, res) {

    if (req.method == 'POST' && req.url == '/new-guid'){
        // Handles a guid creation request.
        // params should be a JSON object in the form of '{"nick": "nicknameString"}'
        // where "nicknameString" is a string of the user's choosing.
        var body = undefined;
        req.on('data', function (data) {
            body = data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'application/json'});
            storeGuid(createGuid(), JSON.parse(body).nick);
            res.end('post received');
        });
    }

    if (req.method == 'POST' && req.url == '/existing-guid'){
        // Allows user to look up an existing GUID by nick.
        // returns JSON object in the form '{"guid":"guidString"}'
        var body = undefined;
        req.on('data', function (data) {
            body = data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/html'});
            findGuid(JSON.parse(body).nick, res);
        });
    }

    if (req.url == "/favicon.ico"){   // handle requests for favico.ico
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }

    if (req.url.indexOf('socket.io-1.3.4.js') != -1) {
        res.setHeader('content-type', 'application/javascript');
        fs.readFile(__dirname + '/../lib/socket.io-1.3.4.js', function (err, data) {
            if (err) console.log(err);
            res.end(data);
        });
    }

    if (req.url.indexOf('client.js') != -1) {
        res.setHeader('content-type', 'application/javascript');
        fs.readFile(__dirname + '/client.js', function (err, data) {
            if (err) console.log(err);
            res.end(data);
        });
    }


    // This is the index file which represents the 'desktop'
    // Here you can link to other apps that use the pathways backend.
    if (req.url == '/') {
      fs.readFile('index.html',    // load html file
          function (err, data) {
              if (err) {
                  res.writeHead(500);
                  return res.end('Error loading index.html');
              }
             res.writeHead(200);
             res.end(data);
          }
      );
    }
}
