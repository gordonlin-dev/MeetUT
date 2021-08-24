const UserController = require('./user.controller')
const AuthValidation = require('../Auth/auth.validations')

exports.routesConfig = function(app){
    app.post('/users/create', [UserController.validateEmail, UserController.validatePassword, UserController.confirmPassword, UserController.sendVerification, UserController.createUser])
    app.post('/users/verify', [UserController.verifyEmail])
    app.get('/users/:userID', [UserController.getById]) // TODO: Include AuthValidation.jwtValid before deleting
    app.delete('/users/delete/:userID', [UserController.deleteUser]) // TODO: Include AuthValidation.jwtValid before deleting
    app.put('/users/updatePassword/:userID', [UserController.validatePassword, UserController.confirmPassword, UserController.updatePassword])
}
