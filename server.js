process.env.NODE_PATH = __dirname + '/lib';
 
// private node.js core method, could change in the future; beware.
require('module').Module._initPaths();

var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io').listen(app);

app.listen(8080);

function handler (req, res) {
    if (req.url == "/favicon.ico"){   // handle requests for favico.ico
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
      }
      fs.readFile('HtmlLedDemo.html',    // load html file
      function (err, data) {
          if (err) {
              res.writeHead(500);
              return res.end('Error loading index.html');
          }
          res.writeHead(200);
          res.end(data);
      });
}
