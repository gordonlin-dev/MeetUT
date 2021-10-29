const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret
const jwtLifeTime = require("../env.config").jwt_expiration_in_hours
exports.auth = (req, res) => {
    try {
        let token = jwt.sign({_id: req.body._id, active: req.body.active},
            jwtSecret, { expiresIn:  jwtLifeTime})
        if (req.body.active) {
            res.status(200).send({accessToken: token})
        } else {
            res.status(403).send({accessToken: token})
        }

    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
}

exports.validateJWT = (req, res) => {
    res.status(200).send()
}
