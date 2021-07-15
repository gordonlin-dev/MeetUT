const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const jwtSecret = require("../env.config").jwt_secret

exports.auth = (req,res) => {
    try{
        let refreshId = req.body.userId + jwtSecret
        let salt = crypto.randomBytes(16).toString('base64')
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64')
        req.body.refreshKey = salt
        let token = jwt.sign(req.body, jwtSecret)
        let b = Buffer.from(hash)
        let refresh_token = b.toString('base64')
        res.status(201).send({accessToken:token, refreshToken: refresh_token})
    }catch (e) {
        res.status(500).send()
    }
}

exports.refresh = (req, res) => {
    try{
        req.body = req.jwt
        let token = jwt.sign(req.body, jwtSecret)
        res.status(201).send({id: token})
    }catch (e) {
        res.status(500).send()
    }
}