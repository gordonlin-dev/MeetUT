const express = require("express");
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));

const io = socket(server);

io.on('connection', function(socket){
    console.log('made socket connection');
    socket.emit('connection', null);
});

io.on('message', function(data){
    console.log(1)
    console.log(data)
    io.socket.send(data)
})
