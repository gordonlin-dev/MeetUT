const express = require("express");
const socket = require('socket.io');
const bodyParser = require('body-parser')
const ChatRouter = require('./routes.config')
const ChatModel = require('./chat.model')
const app = express();
const socketioJwt = require('socketio-jwt');
const jwtSecret = require("./env.config").jwt_secret
const jwt = require('jsonwebtoken')

app.use(bodyParser.json())

const server = app.listen(process.env.PORT || 4000,
    () => console.log("Server is running..."));
ChatRouter.routesConfig(app)
const io = socket(server);


io.on('connection', async (socket) => {
    socket.on('authenticate', (token) => {
        try {
            const jwtToken = jwt.verify(token, jwtSecret)
            const userId = jwtToken._id;
            socket.emit("authenticated", null)
            socket.on('joinRoom', (data) => {
                socket.join(data)
            })
            socket.on('message', async (data) => {
                await ChatModel.addMessage(userId, data.roomID, data.chatMessage)
                socket.in(data.roomID).emit('broadcast', data.chatMessage)
            })
        }catch{
            socket.disconnect()
        }
    })
});

/*
io.on('connection', socketioJwt.authorize({
        secret: jwtSecret,
        timeout: 5000
    })).on('authenticated', async (socket) => {
        socket.on('joinRoom', (data) => {
        socket.join(data)
        })
        socket.on('message', async (data) => {
            const jwtToken = jwt.verify(data.token, jwtSecret)
            const userId = jwtToken._id;
            await ChatModel.addMessage(userId, data.roomID, data.chatMessage)
            socket.in(data.roomID).emit('broadcast', data.chatMessage)
        })
    });
*/
