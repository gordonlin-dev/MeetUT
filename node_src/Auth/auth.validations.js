const UserModel = require('../Users/users.model')
const crypto = require('crypto')

exports.passwordMatch = (req, res, next) =>{
    UserModel.findById(req.body.email).then(
        (user) => {
            //TODO: null check
            let salt, passwordHash = user[0].password.split('$')
            const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64')
            if (passwordHash === hash){
                return next()
            }
        }
    )
}
