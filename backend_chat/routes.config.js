const ChatController = require('./chat.controller')
const AuthValidation = require('./auth.validation')

exports.routesConfig = function(app){
    app.post('/chat/user', [AuthValidation.jwtValid, ChatController.createUser()])
    app.post('/chat/create', [AuthValidation.jwtValid,ChatController.createChat])
    app.get('/chat', [AuthValidation.jwtValid,ChatController.getChatRooms])
    app.get('/chat/room/:roomID', [AuthValidation.jwtValid,ChatController.getChatRoom])
}
