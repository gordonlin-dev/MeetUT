const AuthController = require('./auth.controller')
const AuthValidation = require('./auth.validations')

exports.routesConfig = function(app){
    app.post('/auth', [AuthValidation.passwordMatch, AuthValidation.isActive, AuthController.auth])
    app.get('/auth/validateJWT', [AuthValidation.jwtValid, AuthController.validateJWT])
}
