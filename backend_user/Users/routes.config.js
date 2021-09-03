const UserController = require('./user.controller')
const AuthValidation = require('../Auth/auth.validations')
const AuthController = require('../Auth/auth.controller')

exports.routesConfig = function(app){
    app.post('/users/create', [UserController.validateEmail, UserController.validatePassword, UserController.confirmPassword, UserController.emailVerification, UserController.createUser, AuthController.auth])
    app.post('/users/verify', [UserController.verifyEmail, AuthController.auth]) // TODO: Include AuthValidation.jwtValid
    app.get('/users', [AuthValidation.jwtValid, UserController.getById])
    app.delete('/users/delete', [UserController.deleteUser]) // TODO: Include AuthValidation.jwtValid before deleting
    app.put('/users/updatePassword', [AuthValidation.jwtValid, UserController.validatePassword, UserController.confirmPassword, UserController.updatePassword, AuthValidation.isActive, AuthController.auth])
    app.post('/users/verify/resend', [UserController.emailVerification, UserController.updateCode])
    app.post('/users/forgotPassword/resend', [UserController.passwordVerification, UserController.updatePasswordCode])
    app.post('/users/forgotPassword', [UserController.verifyForgot, AuthController.auth])
}
