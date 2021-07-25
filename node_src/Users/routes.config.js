const UserController = require('./user.controller')

exports.routesConfig = function(app){
    app.post('/users/create', [UserController.createUser])
    app.get('/users/:userId', [UserController.getById])
    app.put('/users/:userId/updatePassword', [UserController.updatePassword])
    app.put('/users/:userId/deleteUser', [UserController.deleteUser])
}