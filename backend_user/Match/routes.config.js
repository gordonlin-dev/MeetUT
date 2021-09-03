const MatchController = require('./match.controller')

exports.routesConfig = function(app){
    app.post('/match/like', [MatchController.like])
}
