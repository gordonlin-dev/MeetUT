const mongoose = require('../mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName : String,
    lastName : String,
    //id is email
    _id : String,
    password : String,
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
        delete result.password
        delete result.__v
        return result
    })
}

exports.createUser = (data) => {
    const user = new User(data)
    return user.save()
}