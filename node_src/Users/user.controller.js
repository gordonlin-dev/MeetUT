const crypto = require('crypto')
const UserModel = require('./users.model')

exports.createUser = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64')
    //TODO: Check and validate req.body.password.
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
    req.body.password = salt + "$" + hash
    UserModel.createUser(req.body).then((result) => {
        res.status(201).send()
    })
}

exports.getById = (req, res) => {
    new Promise((resolve, reject) => {
        UserModel.findById(req.params.userId).then((result) => {
            if (result == "User not found") {
                reject(res.status(202).send(result))
            }else {
                resolve(res.status(200).send(result))
            }
        })
    })
}

exports.updatePassword = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
    req.body.password = salt + "$" + hash
    UserModel.updatePassword(req.body.password, req.params.userId).then((result) => {
        res.status(200).send()
    })
}

exports.deleteUser = (req, res) => {
    new Promise((resolve, reject) => {
        UserModel.deleteUser(req.params.userId).then((result) => {
            if (result == false) {
                reject(res.status(202).send(result))
            }else {
                resolve(res.status(200).send())
            }
        })
    })
}