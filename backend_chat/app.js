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
    socket.on('message', (data) => {
        socket.broadcast.emit('broadcast', data)
    })
});
