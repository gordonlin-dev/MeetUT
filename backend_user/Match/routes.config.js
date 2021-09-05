const MatchController = require('./match.controller')
const AuthValidation = require('../Auth/auth.validations')

exports.routesConfig = function(app){
    app.post('/match/like', [AuthValidation.jwtValid,MatchController.like])
}
