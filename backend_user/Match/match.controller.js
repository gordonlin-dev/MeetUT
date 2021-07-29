const UserModel = require('./users.model')

exports.getMatchList = (req,res) =>{
    res.status(200).send(UserModel.getAllUsers())
}
