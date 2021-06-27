const http = require('http');

const hostname = 'https://uconnect-project.herokuapp.com/';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to MeetUT');
});

server.listen(port, hostname, () => {

});