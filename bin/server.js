var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(app);
var hereGuids = fs.readdirSync(__dirname + '/../guids/here'); // This user's guids

app.listen(8080);

function handler (req, res) {
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
