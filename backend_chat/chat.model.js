const {findOrCreateUsers, findById} = require("./chat.model");
const mongoose = require('./mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id : String,
    firstName:String,
    lastName:String,
    avatar: Number,
    chatRooms: [{
        _id : String,
        active: Boolean,
        displayAvatar: Number,
        displayName: String,
        participants: [String],
        messages : [{
            _id: String,
            createdAt: Date,
            text: String,
            sender: String
        }]
    }]
})

userSchema.set('toJSON', {
    virtuals : true
})

userSchema.findById = function(cb){
    return this.model('Users').find({id: this.id}, cb)
}

const User = mongoose.model('User', userSchema)

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON()
        delete result.__v
        return result
    })
}

exports.createUser = async (userObj) => {
    const user = new User({
        _id : userObj._id,
        firstName:userObj.firstName,
        lastName:userObj.lastName,
        chatRooms: []
    })
    await user.save()
    return user
}
exports.updateAvatar = async (email, avatarId) => {
    const user = await User.findById(email)
    if(user !== null){
        user.avatar = avatarId
        user.save()
    }
    return user
}
exports.findOrCreateUsers = async (usernames) => {
    let users = []
    for (let i = 0; i < usernames.length; i++){
        const user = await User.findById(usernames[i])
        if(user === null){
            const newUser = await this.createUser({_id:usernames[i]})
            users.push(newUser)
        }else{
            users.push(user)
        }
    }
    return users
}
exports.createChatRoom = async (participants) => {
    let roomID = participants[0] + " " + participants[1]
    const newRoom = {
        _id: roomID,
        active:true,
        participants: participants,
        messages: []
    }
    const users = await this.findOrCreateUsers(participants)
    for (let i = 0; i < users.length; i++){
        let user = users[i]
        const roomQuery = user.chatRooms.find(room => room._id.includes(participants[0])
            && room._id.includes(participants[1]))
        if(roomQuery == null){
            user.chatRooms.push(newRoom)
            console.log(newRoom)
            await user.save()
        }
    }
    return roomID
}

exports.getChatRooms = async (userID) => {
    let user = await this.findOrCreateUsers([userID])
    user = user[0]
    for (let i = 0; i < user.chatRooms.length; i++){
        user.chatRooms[i].participants = user.chatRooms[i].participants.filter((value) => {return value !== userID})
        const otherUser = await User.findById(user.chatRooms[i].participants[0])
        user.chatRooms[i].displayAvatar = 0
        user.chatRooms[i].displayName = "Inactive User"
        if(otherUser){
            user.chatRooms[i].displayAvatar = otherUser.avatar? otherUser.avatar : 0
            user.chatRooms[i].displayName = otherUser.firstName + " " + otherUser.lastName
        }
    }
    return user.chatRooms
}

exports.getChatRoomById = async (userID, chatRoomID) => {
    let user = await User.findById(userID)
    let room = user.chatRooms.find((room) => {return room._id === chatRoomID})
    let messages = room.messages
    for (let i = 0; i < messages.length; i++){
        const senderID = messages[i].sender === userID ? 1 : 2
        const messageCopy = {
            text: messages[i].text,
            createdAt: messages[i].createdAt,
            _id : messages[i]._id,
            user : {
                _id : senderID
            }
        }
        messages[i] = messageCopy
    }
    delete room.messages
    let otherUser = await User.findById(chatRoomID.split(" ").filter(x => x !== userID))
    room.displayAvatar = 0
    if(otherUser){
        room.displayAvatar = otherUser.avatar? otherUser.avatar : 0
    }
    return room
}

exports.addMessage = async (userID, roomID, message) => {
    const now = new Date(Date.now())
    let newMessage = {
        text : message[0].text,
        createdAt : now,
        _id : message[0]._id,
        sender: userID
    }

    const room = await this.getChatRoomById(userID, roomID)
    for(let i = 0; i < room.participants.length; i ++){
        let user = await User.findById(room.participants[i])
        const index = user.chatRooms.findIndex((room) => {return room._id === roomID})
        user.chatRooms[index].messages.push(newMessage)
        await user.save()
    }
}

exports.deleteChatRoom = async (curUserId, roomId) => {
    let user = await User.findById(curUserId)
    const otherUserId = roomId.split(" ").filter(x => x !== curUserId)
    let otherUser = await User.findById(otherUserId)
    user.chatRooms = user.chatRooms.filter(x => x._id !== roomId)
    if(otherUser.chatRooms.filter(x => x._id === roomId)[0]){
        otherUser.chatRooms.filter(x => x._id === roomId)[0].active = false
    }
    await user.save()
    await otherUser.save()
    return 1
}

exports.deleteUser = async (userId) =>{
    let user = await User.findById(userId)
    user.delete()
    return 1
}

exports.updateUserName = async (curUserId, firstName, lastName) => {
    let user = await User.findById(curUserId)
    user.firstName = firstName
    user.lastName = lastName
    await user.save()
    return 1
}
