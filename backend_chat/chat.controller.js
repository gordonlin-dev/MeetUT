const ChatModel = require('./chat.model')

exports.createChat = async (req, res)=>{
    //await ChatModel.createChatRoom(["bob@bob.com", "joe@joe.com"])
    await ChatModel.createChatRoom(req.body.participants);
    res.status(200).send()
}

exports.getChatRooms = async (req, res) => {
    const chatRooms = await ChatModel.getChatRooms(req.params.userID)
    res.status(200).send(chatRooms)
}

exports.getChatRoom = async (req, res) => {
    const chatRoom = await ChatModel.getChatRoomById(req.params.userID, req.params.roomID)
    return res.status(200).send(chatRoom)
}

exports.addMessage = async (req, res) => {
    const room = await ChatModel.getChatRoomById(req.body.roomID)
    for(let i = 0; i < room.participants.length; i ++){
        await ChatModel.addMessage(room.participants[i], req.body.roomID, req.body.message)
    }
    return res.status(200).send()
}
