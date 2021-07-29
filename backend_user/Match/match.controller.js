const UserModel = require('../Users/users.model')

exports.getMatchList = (req,res) =>{
    const users = UserModel.getAllUsers()
    console.log(users)
    res.status(200).send(users)
}
