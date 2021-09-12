const ChatModel = require('./chat.model')

exports.createChat = async (req, res)=>{
    await ChatModel.createChatRoom(req.body.participants);
    res.status(200).send()
}

exports.createUser = async (req,res)=>{
    await ChatModel.findOrCreateUsers([req.body._id])
    res.status(200).send()
}
exports.getChatRooms = async (req, res) => {
    const chatRooms = await ChatModel.getChatRooms(req.body._id)
    res.status(200).send(chatRooms)
}

exports.getChatRoom = async (req, res) => {
    const chatRoom = await ChatModel.getChatRoomById(req.body._id, req.params.roomID)
    return res.status(200).send(chatRoom)
}
