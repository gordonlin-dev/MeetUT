const UserModel = require('../Users/users.model')
const axios = require('axios')

exports.like = async (req, res) => {
    const curUserID = req.body._id
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
