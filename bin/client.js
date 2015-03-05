var socket = io();

function openGuid (guid) {
  // Open channel for guid and begin user authentication
  // return the guid specific channel.
  var guidChannel = io.connect('localhost:8080/' + guid);
  return guidChannel
};

function createGuid () {

}
