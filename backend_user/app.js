// create an express app
const express = require("express")
const app = express()
const bodyParser = require('body-parser')

const UserRouter = require('./Users/routes.config')
const AuthRouter = require('./Auth/routes.config')
const AlgorithmRouter = require('./Algorithm/routes.config')
const MatchRouter = require('./Match/routes.config')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json())
UserRouter.routesConfig(app)
AuthRouter.routesConfig(app)
AlgorithmRouter.routesConfig(app)
MatchRouter.routesConfig(app)

// start the server listening for requests
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));
