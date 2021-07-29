const UserModel = require('../Users/users.model')

exports.getMatchList = (req,res) =>{
    UserModel.getAllUsers().then((result) => {
        res.status(200).send(result)
    })
}
