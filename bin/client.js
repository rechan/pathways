var socket = io();
var channel = io.connect('localhost:8080');
var http = new XMLHttpRequest();

//Send the proper header information along with the request
function setHeaders (http) {
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("Content-length", params.length);
  http.setRequestHeader("Connection", "close");
}

function existingNick (nick) {
    http.open('POST', '/existing-nick', true);   
    setHeaders(http);
}

function newNick (nick) {
    http.open('POST', '/new-nick', true);
    setHeaders(http);
}

function readLine (line) {
    var command = line.substr(0,str.indexOf(' '));
    var arg = line.substr(str.indexOf(' ')+1);

        if(command == '/existing') {
            existingNick(arg);
        }
        if (command == '/new') {
            newNick(arg);
        }
}

function submitLine (line) {
    if (line[0] == '/') {
        readline(line);
    } else {
        channel.emmit('message', line);
    }
}
