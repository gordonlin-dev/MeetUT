const crypto = require('crypto')
const UserModel = require('./users.model')
const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret
const validator = require("email-validator");
const presenter = require("../presenter")
const cfg = require("./user.config.json");
const mail = require("nodemailer")
const axios = require("axios");
const endpoints = require('../EndPoints.json')

/**
 * @name createUser
 * @description Create the user requested given that all request data is valid
 * @return status 200 redirect with the tokens required
 */
exports.createUser = async (req, res, next) => {
    let userData = {}
    userData.firstName = req.body.firstName
    userData.lastName = req.body.lastName
    userData._id = req.body._id
    userData.code = req.body.code
    userData.password = getPasswordHash(req.body.password)
    userData.active = false
    userData.completedOnboarding = false
    userData.avatar = 0

    let token = jwt.sign({_id: userData._id, active: true}, jwtSecret)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    const response1 = await axios.post(endpoints.Chat.CreateUser, {
    }, {headers : headers})

    const response2 = await axios.post(endpoints.Onboarding.CreateUser, {
        FirstName:userData.firstName,
        LastName: userData.lastName
    },{
        headers : headers
    })
    if(response1.status === 200 && response2.status === 200){
        await UserModel.createUser(userData)
        next()
    }
    res.status(500).send()
}

/**
 * @name emailVerification
 * @description Send the email for verification given that the request body is valid
 * @return next if sent successfully, or status 400 otherwise
 */
exports.emailVerification = (req, res, next) => {
    const code = getCode()
    console.log(code) // TODO: Remove for production use
    req.body.active = false
    req.body.code = getHash(cfg.codeSalt, code)
    try {
        email_verification(req.body._id, code).then()
        return next()
    } catch (e) {
        console.log(e)
        return res.status(400).send(presenter.invalidEmail("code"))
    }
}

/**
 * @name passwordVerification
 * @description Send the email for verification given that the request body is valid
 * @return next if sent successfully, or status 400 otherwise
 */
exports.passwordVerification = (req, res, next) => {
    userExists(req.body._id).then((result) => {
        if (!result) {
            return res.status(400).send(presenter.invalidUser("null"))
        }
    })

    const code = getCode()
    console.log(code) // TODO: Remove for production use
    req.body.code = getHash(cfg.codeSalt, code)
    try {
        email_verification(req.body._id, code).then()
        return next()
    } catch (e) {
        console.log(e)
        return res.status(400).send(presenter.invalidEmail("code"))
    }
}

exports.updatePasswordCode = (req, res) => {
    UserModel.updatePasswordCode(req.body._id, req.body.code).then((result) => {
        if (result != null) {
            res.status(201).send(presenter.updateCode())
        } else {
            res.status(404).send(presenter.invalidUser("null"))
        }
    })
}

exports.updateCode = (req, res) => {
    UserModel.updateCode(req.body._id, req.body.code).then((result) => {
        if (result != null) {
            res.status(201).send(presenter.updateCode())
        } else {
            res.status(404).send(presenter.invalidUser("exist"))
        }
    })
}

/**
 * @name verifyEmail
 * @description Check if the posted code is the same as the stored code, and activate the account if needed
 */
exports.verifyEmail = (req, res, next) => { // TODO: Set max times
    UserModel.getUserCode(req.body._id).then((result) => {
        req.body.verification = getHash(cfg.codeSalt, req.body.verification)
        if (req.body.verification === result) {
            req.body.active = true
            UserModel.activateUser(req.body._id).then(() => {
                return next()
            })
        } else {
            return res.status(400).send(presenter.invalidCode())
        }
    })
}

/**
 * @name verifyForgot
 * @description Check if the posted code is the same as the stored code, and activate the account if needed
 */
exports.verifyForgot = (req, res, next) => { // TODO: Set max times
    UserModel.getPasswordCode(req.body._id).then((result) => {
        req.body.verification = getHash(cfg.codeSalt, req.body.verification)
        if (req.body.verification === result) {
            req.body.active = true
            UserModel.activateUser(req.body._id).then(() => { return next() })
        } else {
            return res.status(400).send(presenter.invalidCode())
        }
    })
}

/**
 * @name getById
 * @description Get a user's information by the given id
 * @return status 200 redirect if request is valid, or status 404 if user does not exist
 */
exports.getById = (req, res) => {
    UserModel.getUserInfoById(req.body._id).then((result) => {
        if (result != null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(presenter.invalidUser("null"))
        }
    })
}

/**
 * @name deleteUser
 * @description Delete the given user
 * @return status 200 redirect if request is valid, or status 404 if user does not exist
 */
exports.deleteUser = (req, res) => {
    UserModel.deleteUser(req.body._id).then((result) => {
        if (result) {
            res.status(200).send()
        } else {
            res.status(401).send()
        }
    })
}

exports.getAvatar = (req, res) => {
    UserModel.getAvatar(req.body._id).then((result) => {
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(500).send()
        }
    })
}

exports.setAvatar = (req, res) => {
    UserModel.setAvatar(req.body._id, req.body.avatar).then((result => {
        if (result) {
            res.status(200)
        } else {
            res.status()
        }
    }))
}

/**
 * @name updatePassword
 * @description Update the password of the given user
 * @return status 200 redirect if request is valid, or status 404 if user does not exist
 */
exports.updatePassword = (req, res, next) => {
    req.body.password = getPasswordHash(req.body.password)
    UserModel.updatePassword(req.body._id, req.body.password).then((result) => {
        if (result != null) {
            return next()
        } else {
            res.status(404).send(presenter.invalidUser("exist"))
        }
    })
}

/**
 * @name validatePassword
 * @description Validates password by checking if the password length is between cfg.passwordMin and cfg.passwordMax
 * @return next if password is valid, or status 400 if password is invalid
 */
exports.validatePassword = (req, res, next) => {
    console.log(req.body)
    if (req.body.password.length < cfg.passwordMin || req.body.password.length > cfg.passwordMax) {
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
    req.body._id = req.body._id.toLowerCase().trim()
    userExists(req.body._id).then((result) => {
        if (result) {
            return res.status(400).send(presenter.invalidUser("exist"))
        }

        if (!validator.validate(req.body._id)) {
            return res.status(400).send(presenter.invalidEmail("address"))
        }

        const domain = req.body._id.split("@")[1]
        if (!cfg.emailDomains.includes(domain)) {
            return res.status(400).send(presenter.invalidEmail("domain"))
        }

        return next()
    })
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

/**
 * @name getSalt
 * @description An algorithm to get the salt for a password hash
 * @return string The salt of the algorithm
 */
getSalt = () => {
    return crypto.randomBytes(16).toString('base64')
}

/**
 * @name getHash
 * @description An algorithm to get the hash of a key
 * @return string the hash of the given key
 */
getHash = (salt, key) => {
    return crypto.createHmac('sha512', salt).update(key).digest('base64')
}

/**
 * @name getPasswordHash
 * @description An algorithm to get the salt/hash combination of a password
 * @return string The hash of the given password
 */
getPasswordHash = (password) => {
    let salt = getSalt()
    let hash = getHash(salt, password)
    return salt + "$" + hash
}

/**
 * @name getTokens
 * @description An algorithm to get and set all necessary tokens for the given request
 * @returns {{accessToken: (*), refreshToken: string}}
 */
getTokens = (req, user) => {
    let accessToken = jwt.sign({_id: user._id}, jwtSecret)
    let salt = getSalt()
    req.body.refreshKey = salt
    let refreshId = req.body._id + jwtSecret
    let hash = getHash(salt, refreshId)
    let buffer = Buffer.from(hash)
    let refresh_token = buffer.toString('base64')
    return {accessToken: accessToken, refreshToken: refresh_token}
}

/**
 * @name getCode
 * @description Generate and return a 6 digit code
 * @returns {string} Generated code
 */
getCode = () => {
    return "" + Math.floor(100000 + Math.random() * 900000)
}

/**
 * @name userExists
 * @description Check if user exists
 * @return boolean True if user exists, and False otherwise
 */
userExists = (id) => {
    return UserModel.exists(id).then((result) => {
        return result
    })
}

/**
 * @name email_verification
 * @param recipient The email of the new user
 * @param code The code to be sent to the new user
 * @returns {Promise<void>}
 */
async function email_verification(recipient, code) {
    let transporter = mail.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: cfg.mailUser,
            pass: cfg.mailPassword,
        },
    });

    await transporter.sendMail({
        from: cfg.mailSender, // sender address
        to: recipient, // list of receivers
        subject: presenter.verificationEmail("subject"), // Subject line
        text: presenter.verificationEmail("text", code), // plain text body
        html: "<b>" + presenter.verificationEmail("text", code) + "</b>", // html body
    });
}
