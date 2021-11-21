const jwt = require('jsonwebtoken')
const jwtSecret = require("./env.config").jwt_secret

exports.jwtValid = (req, res, next) => {
    return next()
    try {
        let authorization = req.headers['authorization'].split(' ')
        req.jwt = jwt.verify(authorization[1], jwtSecret)
        req.body._id = req.jwt._id;
        if (req.jwt.active) {
            return next()
        } else {
            return res.status(403).send()
        }
    } catch (err) {
        return res.status(401).send()
    }
}
