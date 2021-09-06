const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret

exports.auth = (req, res) => {
    try {
        let token = jwt.sign({_id: req.body._id, active: req.body.active}, jwtSecret)
        if (req.body.active) {
            res.status(201).send({accessToken: token})
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
