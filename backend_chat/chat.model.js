const mongoose = require('./mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id : String,
    chatRooms: [{
        _id : String,
        participants: [String],
        messages : [{
            senderId : String,
            content : String
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
    const user = await User.findById(userID)
    return user.chatRooms
}
