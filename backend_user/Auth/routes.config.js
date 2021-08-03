const AuthController = require('./auth.controller')
const AuthValidation = require('./auth.validations')

exports.routesConfig = function(app){
    app.post('/auth', [AuthValidation.passwordMatch,AuthController.auth])
    app.put('/auth/validateJWT', [AuthValidation.jwtValid, AuthController.validateJWT])
}
