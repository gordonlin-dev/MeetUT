const ChatModel = require('./chat.model')

exports.createChat = async (req, res)=>{
    await ChatModel.createChatRoom(req.body.participants);
    res.status(200).send()
}

exports.createUser = async (req,res)=>{
    let userObj = {
        _id:req.body._id,
        firstName:req.body.FirstName,
        lastName: req.body.LastName
    }
    await ChatModel.createUser(userObj)
    res.status(200).send()
}

exports.deleteUser = async (req, res) => {
    await ChatModel.deleteUser(req.body._id)
    return res.status(200).send()
}
exports.getChatRooms = async (req, res) => {
    const chatRooms = await ChatModel.getChatRooms(req.body._id)
    res.status(200).send(chatRooms)
}

exports.getChatRoom = async (req, res) => {
    const chatRoom = await ChatModel.getChatRoomById(req.body._id, req.params.roomID)
    return res.status(200).send(chatRoom)
}

exports.updateAvatar = async (req, res) => {
    await ChatModel.updateAvatar(req.body._id, req.body.avatarId)
    return res.status(200).send()
}

exports.deleteChatRoom = async (req, res) =>{
    await ChatModel.deleteChatRoom(req.body._id, req.body.roomId)
    res.status(200).send()
}

exports.updateUserName = async (req,res) => {
    await ChatModel.updateUserName(req.body._id, req.body.firstName, req.body.lastName)
    res.status(200).send()
}
