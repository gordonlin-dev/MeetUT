const express = require("express");
const socket = require('socket.io');
const bodyParser = require('body-parser')
const ChatRouter = require('./routes.config')

const app = express();

app.use(bodyParser.json())

const server = app.listen(process.env.PORT || 4000,
    () => console.log("Server is running..."));
ChatRouter.routesConfig(app)
const io = socket(server);

io.on('connection', async (socket) => {
    socket.emit('connection', null);
    socket.on('joinRoom', (data) => {
        socket.join(data)
    })
    socket.on('message', (data) => {
        console.log(data)
        socket.in(data.roomID).emit('broadcast', data.chatMessage)
        //socket.broadcast.emit('broadcast', data)
    })
});
