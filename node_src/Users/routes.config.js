const UserController = require('./user.controller')

exports.routesConfig = function(app){
    app.post('/users/create', [UserController.createUser])
    app.get('/users/:userId', [UserController.getById])
}