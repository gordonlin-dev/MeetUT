const express = require("express");
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));

const io = socket(server);

io.on('connection', async (socket) => {
    console.log('made socket connection');
    socket.emit('connection', null);
    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('broadcast', data)
    })
});
