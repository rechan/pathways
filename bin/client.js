var socket = io();
var channel = io.connect('localhost:8080/nickserv');
var http = new XMLHttpRequest();

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
http.setRequestHeader("Content-length", params.length);
http.setRequestHeader("Connection", "close");

function existingNick (nick) {
    http.open('POST', '/existing-nick', true);   
}

function newNick (nick) {
    http.open('POST', '/new-nick', true);
}

function readLine (line) {
    var command = line.substr(0,str.indexOf(' '));
    var arg = line.substr(str.indexOf(' ')+1);

    switch command {
        case '/existing':
            existingNick(arg);
            break;
        case '/new':
            newNick(arg);
}

function submitLine (line) {
    if (line[0] == '/') {
        readline(line);
    } else {
        channel.emmit('message', line);
    }
}
