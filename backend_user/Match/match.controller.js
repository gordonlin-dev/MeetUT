const UserModel = require('../Users/users.model')
const axios = require('axios')

exports.getMatchList = (req,res) =>{
    UserModel.getAllUsers().then((result) => {
        res.status(200).send(result)
    })
}

exports.like = (req, res) => {
    const curUser = req.body.curUser
    const likedUser = req.body.likedUser
    const url = 'https://meet-ut-3.herokuapp.com/chat/create'
    axios.post(url, {
        participants: [curUser, likedUser]
    }).then(
        resp => {
            res.status(200).send()
        }
    ).catch(error => {
        console.error(error)
    })
}
