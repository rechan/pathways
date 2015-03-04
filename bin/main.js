var net = require('net-browserify');

net.setProxy({
  hostname: 'localhost',
  port: 8081
});

var socket = net.connect({}, function() {});

socket.write("hello world");
