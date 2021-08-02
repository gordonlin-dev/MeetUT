const mongoose = require('../mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName : String,
    lastName : String,
    //id is email
    _id : String,
    password : String,
    //
    isArchived : Boolean
})

userSchema.virtual('email').get(function (){
    return this._id
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

exports.getUserInfoById = (id) => {
    return User.findById(id).then((result) => {
        if (result.isArchived) {
            return null
        }else {
            result = result.toJSON()
            delete result.password
            delete result.__v
            return result
        }
    })
}

exports.createUser = (data) => {
    const user = new User(data)
    user.isArchived = false
    return user.save()
}

exports.deleteUser = (id) => {
    return User.findById(id).then((result) => {
        if (result.isArchived) {
            return null
        }else {
            result.isArchived = true
            return result.save()
        }
    })
}

exports.getAllUsers = () => {
    return User.find({}).then((result) =>{
        for (const item in result) {
            const user = result[item].toJSON()
            delete user.password
            delete user.__v
            result[item] = user
        }
        return result
    })
}

exports.updatePassword = (id, data) => {
    return User.findById(id).then((result) => {
        if (result.isArchived) {
            return null
        }else {
            result.password = data
            return result.save()
        }
    })
}

exports.validatePassword = (data) => {
    return data != ""
}

exports.validateEmail = (data) => {
    let domain = data.split("@")[1]
    return domain == "mail.utoronto.ca"
}