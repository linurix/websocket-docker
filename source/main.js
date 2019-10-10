const WSS = require('websocket').server;
const http = require('http');


var server = http.createServer(function (request, response) {

    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();

});


server.listen(8080, function () {

    console.log((new Date()) + ' Server is listening on port 8080');

});


const wss = new WSS({
    httpServer: server,
    autoAcceptConnections: false
})


function originIsAllowed(origin) {
    console.log(origin)
    const allowedOrigins = ['http://localhost:8181', 'http://app.toolsforschools.localhost', 'https://app.toolsforschools.localhost', 'https://app.toolsforschools.ch'];
    if (allowedOrigins.indexOf(origin) >= 0) {
        return true;
    } else {
        return false;
    }

}

let connections = [];


wss.on('request', function (request) {

    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('chat', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {

            const nachricht = message.utf8Data;
            console.log('Received Message: ' + nachricht);

            let command = 'apikey:'
            if (nachricht.indexOf(command) == 0) {
                apikey = nachricht.substr(command.length)
                connections[apikey] = connection;
            } else {
                connections[apikey].sendUTF(nachricht);
            }


            connections[apikey].sendUTF("MESSAGE SENT");

        }


    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});