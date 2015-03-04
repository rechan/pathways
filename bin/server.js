var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(8080);

function handler (req, res) {
    if (req.url == "/favicon.ico"){   // handle requests for favico.ico
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
      }
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
