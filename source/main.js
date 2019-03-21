`use strict`;
const http = require(`http`);

const requestHandler = function(req, res){
    res.end(`Hello from main.js!`);
};

const server = http.createServer(requestHandler);

server.listen(8080, function(err){
    console.log(`Server main.js started!`);
});