const ChatController = require('./chat.controller')

exports.routesConfig = function(app){
    app.post('/chat/create', [ChatController.createChat])
    app.get('/chat', [ChatController.getChatRooms])
}
