// Takes a socket.io object
module.exports = function (io) {
  io.on('connection', function(socket){
      console.log('a user connected');
  });
} 
