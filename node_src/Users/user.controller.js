const crypto = require('crypto')
const UserModel = require('users.model')

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
    UserModel.findById(req.params.userId).then((result) => {
        res.status(200).send(result)
    })
}