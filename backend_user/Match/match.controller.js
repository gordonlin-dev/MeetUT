const UserModel = require('../Users/users.model')
const axios = require('axios')

exports.getMatchList = (req,res) =>{
    UserModel.getAllUsers().then((result) => {
        result = result.filter((user) => user._id !== req.params.userID)
        res.status(200).send(result)
    })
}

exports.like = async (req, res) => {
    const curUserID = req.body.curUser
    const likedUserID = req.body.likedUser
    const curUser = await UserModel.like(curUserID,likedUserID)
    if(curUser.matched[likedUserID]){
        const url = 'https://meet-ut-3.herokuapp.com/chat/create'
        const response = await axios.post(url, {
            participants: [curUserID, likedUserID]
        })
        res.status(200).send()
    }
    res.status(200).send()
}
