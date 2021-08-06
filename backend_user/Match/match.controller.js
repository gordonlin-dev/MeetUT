const UserModel = require('../Users/users.model')
const axios = require('axios')

exports.getMatchList = (req,res) =>{
    UserModel.getAllUsers().then((result) => {
        result = result.filter((user) => user._id !== req.params.userID)
        res.status(200).send(result)
    })
}

exports.like = async (req, res) => {
    const curUser = req.body.curUser
    const likedUser = req.body.likedUser
    const url = 'https://meet-ut-3.herokuapp.com/chat/create'
    const response = await axios.post(url, {
        participants: [curUser, likedUser]
    })
    res.status(200).send()
}
