var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(app);
var hereGuids = fs.readdirSync(__dirname + '/../guids/here'); // This user's guids
var cp = require('child_process');
var level = require('level');
var guidDb = level('./guids');
var crypto = require('crypto');

app.listen(8080);

function createGuid () {
    return crypto.randomBytes(20).toString('hex');
}

function storeGuid (guid, nick) {
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
        res.write(
           JSON.stringify({guid: value}) 
        );
        return true;
    });
}

function handler (req, res) {

    if (req.method == 'POST' && req.url == '/new-guid'){
        // Handles a guid authentication post
        var body = undefined;
        req.on('data', function (data) {
            body = data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('post received');
            storeGuid(createGuid(), JSON.parse(body).nick);
        });
    }

    if (req.method == 'POST' && req.url == '/existing-guid'){
        var body = undefined;
        req.on('data', function (data) {
            body = data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('post received');
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
        fs.readFile(__dirname + '/../lib/socket.io-1.3.4.js', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });
    }

    if (req.url.indexOf('client.js') != -1) {
        fs.readFile(__dirname + '/client.js', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });
    }


    // Respond to client wanting to connect to an existing hereGuid
    

    fs.readFile('index.html',    // load html file
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

io.on('connection', function(socket){
    console.log('a user connected');
});
