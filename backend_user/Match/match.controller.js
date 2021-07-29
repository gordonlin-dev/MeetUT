const UserModel = require('../Users/users.model')

exports.getMatchList = (req,res) =>{
    res.status(200).send(UserModel.getAllUsers())
}
