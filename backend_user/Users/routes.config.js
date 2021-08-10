const UserController = require('./user.controller')
const AuthValidation = require('../Auth/auth.validations')

exports.routesConfig = function(app){
    app.post('/users/create', [UserController.validateEmail, UserController.validatePassword, UserController.confrimPassword, UserController.createUser])
    app.get('/users/:userID', [AuthValidation.jwtValid,UserController.getById])
    app.delete('/users/:userID', [AuthValidation.jwtValid,UserController.deleteUser])
    app.put('/users/:userID/updatePassword', [AuthValidation.jwtValid, UserController.validatePassword, UserController.confirmPassword, UserController.updatePassword])
    
}
