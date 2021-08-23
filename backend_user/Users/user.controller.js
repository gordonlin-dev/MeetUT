const crypto = require('crypto')
const UserModel = require('./users.model')
const jwt = require('jsonwebtoken')
const jwtSecret = require("../env.config").jwt_secret
const validator = require("email-validator");
const presenter = require("./user.presenter")
const cfg = require("./user.config.json");
const mail = require("nodemailer")

/**
 * @name createUser
 * @description Create the user requested given that all request data is valid
 * @return status 200 redirect with the tokens required
 */
exports.createUser = (req, res) => {
    req.body.password = getPasswordHash(req.body.password)
    UserModel.createUser(req.body).then((user) => {
        res.status(200).send(getTokens(req, user))
    })
}

/**
 * @name getById
 * @description Get a user's information by the given id
 * @return status 200 redirect if request is valid, or status 404 if user does not exist
 */
exports.getById = (req, res) => {
    UserModel.getUserInfoById(req.params.userID).then((result) => {
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
    UserModel.deleteUser(req.params.userID)
    res.status(200).send()
}

/**
 * @name updatePassword
 * @description Update the password of the given user
 * @return status 200 redirect if request is valid, or status 404 if user does not exist
 */
exports.updatePassword = (req, res) => {
    req.body.password = getPasswordHash(req.body.password)
    UserModel.updatePassword(req.params.userID, req.body.password).then((result) => {
        if (result != null) {
            res.status(200).send(presenter.updatedPassword())
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
    if (!validator.validate(req.body._id)) {
        return res.status(400).send(presenter.invalidEmail("address"))
    }

    const domain = req.body._id.split("@")[1]
    if (!cfg.emailDomains.includes(domain)) {
        return res.status(400).send(presenter.invalidEmail("domain"))
    }

    if (userExists(req.body._id)) {
        return res.status(400).send(presenter.invalidUser("exist"))
    }

    const code = getCode()
    try {
        email_verification(req.body._id, code).then()
    } catch (e) {
        console.log(e)
        return res.status(400).send(presenter.invalidEmail("code"))
    }
    req.body.code = getHash(getSalt(), code)
    return next()
    // TODO: Confirm code
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
    return UserModel.exists(id)
}

/**
 * @name email_verification
 * @param recipient The email of the new user
 * @param code The code to be sent to the new user
 * @returns {Promise<void>}
 */
async function email_verification(recipient, code) {
    // create reusable transporter object using the default SMTP transport
    let transporter = mail.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "mailmeetut@gmail.com",
            pass: "meetutmail",
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: cfg.mailSender, // sender address
        to: recipient, // list of receivers
        subject: presenter.verificationEmail("subject"), // Subject line
        text: presenter.verificationEmail("text", code), // plain text body
        html: "<b>" + presenter.verificationEmail("text", code) + "</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", mail.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

