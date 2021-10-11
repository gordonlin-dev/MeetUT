const UserModel = require('../Users/users.model')
const axios = require('axios')
const endpoints = require('../EndPoints.json')
exports.like = async (req, res) => {
    const curUserID = req.body._id
    const likedUserID = req.body.likedUser
    const curUser = await UserModel.like(curUserID,likedUserID)
    if(curUser.matched[likedUserID]){
        const url = endpoints.Chat.CreateChat
        const config = {
            headers: req.headers
        };
        const response = await axios.post(url, {
            participants: [curUserID, likedUserID]
        }, config)
        res.status(200).send()
    }
    res.status(200).send()
}
