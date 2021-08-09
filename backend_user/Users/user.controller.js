const crypto = require('crypto')
const UserModel = require('./users.model')
const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret

exports.createUser = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64')
    //TODO: Check and validate req.body.password.
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
    req.body.password = salt + "$" + hash
    UserModel.createUser(req.body).then((result) => {
        let refreshId = req.body._id + jwtSecret
        let salt = crypto.randomBytes(16).toString('base64')
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64')
        req.body.refreshKey = salt
        let token = jwt.sign({_id:result._id}, jwtSecret)
        let b = Buffer.from(hash)
        let refresh_token = b.toString('base64')
        res.status(201).send({accessToken:token, refreshToken: refresh_token})
    })
}

exports.getById = (req, res) => {
    UserModel.getUserInfoById(req.params.userID).then((result) => {
        if (result == null) {
            res.status(404).send("User not found")
        } else {
            res.status(200).send(result)
        }
    })
}

exports.deleteUser = (req, res) => {
    UserModel.deleteUser(req.params.userID).then((result) => {
        if (result == null) {
            res.status(404).send("User not found")
        }else {
            res.status(200).send()
        }
    })
}

exports.updatePassword = (req, res) => {
        let salt = crypto.randomBytes(16).toString('base64')
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
        req.body.password = salt + "$" + hash
        UserModel.updatePassword(req.params.userID, req.body.password).then((result) => {
            if (result == null) {
                res.satus(404).send("User not found")
            }else {
                res.status(200).send()
            }
        })
}

exports.validatePassword = (req, res, next) => {
    if (req.body.password != "") {
        return next()
    } else {
        return res.status(400).send("Password required")
    }
}

exports.validateEmail = (req, res, next) => {
    let domain = req.body._id.split("@")[1]
    if (domain == "mail.utoronto.ca") {
        return next()
    } else {
        return res.status(400).send("Invalid email address")
    }
}

exports.confrimPassword = (req, res, next) => {
    let password = req.body.password
    let confirm = req.body.confirm
    if (password == confirm) {
        return next()
    } else {
        return res.status(400).send("Password not confirmed")
    }
}