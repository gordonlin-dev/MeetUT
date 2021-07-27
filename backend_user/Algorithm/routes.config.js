const Algorithm = require('./algorithm.logic')

exports.routesConfig = function(app){
    app.post('/algorithm/calculate', [Algorithm.calculate])
}
