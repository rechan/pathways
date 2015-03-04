Pathways
========

Currently implemented as a socket.io interface over low level node http server.
This server will be loaded onto an ARM device (BBB) to run at boot time, exposing the server with a socket connection at port 8080 for that device's IP address (192.168.7.2 by default). The 'index.html' served there automatically connects with the server side socket socket.io client library.
