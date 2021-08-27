const UserModel = require('../Users/users.model')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const jwtSecret = require("../env.config").jwt_secret

exports.passwordMatch = (req, res, next) =>{
    UserModel.findById(req.body._id).then((user) => {
            //TODO: null check
            let parts = user.password.split('$')
            let salt = parts[0]
            let passwordHash = parts[1]
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
            if (passwordHash === hash){
                return next()
            } 
        }
    )
}

exports.jwtValid = (req, res, next) => {
    try{
        let authorization = req.headers['authorization'].split(' ')
        req.jwt = jwt.verify(authorization[1], jwtSecret)
        return next()
    }catch (err){
        return res.status(401).send()
    }
}

exports.isActive = (req, res, next) => {
    return getInfo(req.body._id).then((result) => {
        if (result == null) {
            return res.status(404).send()
        } else {
            req.body.active = result.active
            return next()
        }
    })
}

getInfo = (id) => {
    return UserModel.getUserInfoById(id).then((result) => {
        if (result != null) {
            return result
        }
    })
}
