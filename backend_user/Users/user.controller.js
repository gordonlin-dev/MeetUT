const crypto = require('crypto')
const UserModel = require('./users.model')
const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret
const validator = require("email-validator");
const presenter = require("./user.presenter")
const cfg = require("./user.config.json");

exports.createUser = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
    req.body.password = salt + "$" + hash
    UserModel.createUser(req.body).then((result) => {
        let refreshId = req.body._id + jwtSecret
        let salt = crypto.randomBytes(16).toString('base64')
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64')
        req.body.refreshKey = salt
        let token = jwt.sign({_id: result._id}, jwtSecret)
        let b = Buffer.from(hash)
        let refresh_token = b.toString('base64')
        res.status(200).send({accessToken: token, refreshToken: refresh_token})
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
        } else {
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
            res.status(404).send("User not found")
        } else {
            res.status(200).send()
        }
    })
}

/**
 * @name validatePassword
 * @description Validates password by checking if the password length is between cfg.passwordMin and cfg.passwordMax
 * @return next if password is valid, or status 400 if password is invalid
 */
exports.validatePassword = (req, res, next) => {
    if (req.body.password.length <= cfg.passwordMin || req.body.password.length >= cfg.passwordMax) {
        return res.status(400).send(presenter.invalidPassword("length"))
    } else {
        return next()
    }
}

/**
 * @name validateEmail
 * @description Validates email by format and domain name
 * @return next if email is valid, or status 400 if password is invalid
 */
exports.validateEmail = (req, res, next) => {
    if (!validator.validate(req.body._id)) {
        return res.status(400).send(presenter.invalidEmail("address"))
    }

    const domain = req.body._id.split("@")[1]
    if (!cfg.emailDomains.includes(domain)) {
        return res.status(400).send(presenter.invalidEmail("domain"))
    } else {
        return next()
    }
}

/**
 * @name confirmPassword
 * @description Checks if the password and confirm password fields have the same input
 * @returns next if email is valid, or status 400 if passwords do not match
 */
exports.confirmPassword = (req, res, next) => {
    if (req.body.password !== req.body.confirm) {
        return res.status(400).send(presenter.invalidPassword("match"))
    } else {
        return next()
    }
}
