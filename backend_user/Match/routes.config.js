const MatchController = require('./match.controller')

exports.routesConfig = function(app){
    app.get('/match/', [MatchController.getMatchList])
    app.post('/match/like', [MatchController.like])
}
