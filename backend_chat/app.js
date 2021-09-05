const express = require("express");
const socket = require('socket.io');
const bodyParser = require('body-parser')
const ChatRouter = require('./routes.config')
const ChatModel = require('./chat.model')
const app = express();
const socketioJwt = require('socketio-jwt');
const jwtSecret = require("./env.config").jwt_secret

app.use(bodyParser.json())

const server = app.listen(process.env.PORT || 4000,
    () => console.log("Server is running..."));
ChatRouter.routesConfig(app)
const io = socket(server);

/*
io.on('connection', async (socket) => {
    socket.emit('connection', null);
    socket.on('joinRoom', (data) => {
        socket.join(data)
    })
    socket.on('message', async (data) => {
        await ChatModel.addMessage(data.userID, data.roomID, data.chatMessage)
        socket.in(data.roomID).emit('broadcast', data.chatMessage)
    })
});*/

io.on('connection', socketioJwt.authorize({
        secret: jwtSecret,
        timeout: 5000
    })).on('authenticated', async (socket) => {
        socket.on('joinRoom', (data) => {
        socket.join(data)
        })
        socket.on('message', async (data) => {
            await ChatModel.addMessage(data.userID, data.roomID, data.chatMessage)
            socket.in(data.roomID).emit('broadcast', data.chatMessage)
        })
    });
