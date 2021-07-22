const AuthController = require('./auth.controller')

exports.routesConfig = function(app){
    app.post('/auth', [AuthController.auth])
}
