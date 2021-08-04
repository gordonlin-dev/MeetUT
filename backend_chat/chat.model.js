const mongoose = require('./mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id : String,
    chatRooms: [{
        _id : String,
        participants: [String],
        messages : [{
            _id: String,
            createdAt: String,
            text: String,
            user: {
                _id: String
            }
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

exports.createUser = async (email) => {
    const user = new User({
        _id : email,
        chatRooms: []
    })
    await user.save()
    return user
}

exports.findOrCreateUsers = async (usernames) => {
    let users = []
    for (let i = 0; i < usernames.length; i++){
        const user = await User.findById(usernames[i])
        if(user === null){
            const newUser = await this.createUser(usernames[i])
            users.push(newUser)
        }else{
            users.push(user)
        }
    }
    return users
}
exports.createChatRoom = async (participants) => {
    let roomID = ""
    for (let i = 0; i < participants.length; i++){
        roomID = roomID + participants[i] + " "
    }

    roomID = roomID.trim()
    const newRoom = {
        _id: roomID,
        participants: participants,
        messages: []
    }
    const users = await this.findOrCreateUsers(participants)
    for (let i = 0; i < users.length; i++){
        let user = users[i]
        const roomQuery = user.chatRooms.find(room => room._id === roomID)
        if(roomQuery == null){
            user.chatRooms.push(newRoom)
            await user.save()
        }
    }
    return roomID
}

exports.getChatRooms = async (userID) => {
    let user = await User.findById(userID)
    for (let i = 0; i < user.chatRooms.length; i++){
        user.chatRooms[i].participants = user.chatRooms[i].participants.filter((value) => {return value !== userID})
    }
    return user.chatRooms
}

exports.getChatRoomById = async (userID, chatRoomID) => {
    let user = await User.findById(userID)
    const room = user.chatRooms.find((room) => {return room._id === chatRoomID})
    return room
}

exports.addMessage = async (roomID, message) => {
    const room = await ChatModel.getChatRoomById(roomID)
    for(let i = 0; i < room.participants.length; i ++){
        let user = await User.findById(room.participants[i])
        const index = user.chatRooms.findIndex((room) => {return room._id === roomID})
        user.chatRooms[index] = user.chatRooms[index].messages.push(message)
    }
}
