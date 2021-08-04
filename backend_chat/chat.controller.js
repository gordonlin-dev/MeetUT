const ChatModel = require('./chat.model')

exports.createChat = async (req, res)=>{
    //await ChatModel.createChatRoom(["bob@bob.com", "joe@joe.com"])
    await ChatModel.createChatRoom(req.body.participants);
    res.status(200).send()
}

exports.getChatRooms = async (req, res) => {
    const chatRooms = await ChatModel.getChatRooms(req.body.userID)
    res.status(200).send(chatRooms)
}
