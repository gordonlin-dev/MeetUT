// TODO: Test and debug
const mongoose = require('../mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    active: Boolean,
    code: String,
    firstName: String,
    lastName: String,
    _id: String,
    password: String,
    isArchived: Boolean,
    likedBy: {},
    matched: {}
}, {strict: false})

userSchema.virtual('email').get(function () {
    return this._id
})

userSchema.set('toJSON', {
    virtuals: true
})


userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb)
}

const User = mongoose.model('User', userSchema)

exports.exists = (id) => {
    return User.findById(id).then((result) => {
        return (result != null)
    })
}

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        if (result == null) {
            return null
        } else {
            result = result.toJSON()
            delete result.__v
            return result
        }
    })
}

exports.getUserInfoById = (id) => {
    return User.findById(id).then((result) => {
        if (result == null) {
            return null
        } else if (result.isArchived) {
            return null
        } else {
            result = result.toJSON()
            delete result.password
            delete result.__v
            return result
        }
    })
}

exports.activateUser = (id) => {
    return User.findById(id).then((result) => {
        if (result != null) {
            result.code = undefined // Deletes key in document
            result.active = true
            return result.save()
        } else {
            console.log("no id")
        }
    })
}

exports.createUser = (data) => {
    const user = new User(data)
    return user.save()
}

exports.archiveUser = (id) => {
    return User.findById(id).then((result) => {
        if (result.isArchived) {
            return null
        } else {
            result.isArchived = true
            return result.save()
        }
    })
}

exports.deleteUser = (id) => {
    return User.findById(id).then((result) => {
        if (result == null) {
            return null
        } else {
            result.deleteOne()
        }
    })
}

exports.getAllUsers = () => {
    return User.find({}).then((result) => {
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
        } else {
            result.password = data
            return result.save()
        }
    })
}

exports.like = async (curUser, likedUser) => {
    let cur = await User.findById(curUser)
    let liked = await User.findById(likedUser)
    if (cur.likedBy == null) {
        cur.likedBy = {}
    }
    if (liked.likedBy == null) {
        liked.likedBy = {}
    }
    if (cur.matched == null) {
        cur.matched = {}
    }
    if (liked.matched == null) {
        liked.matched = {}
    }
    const curUserLiked = cur.likedBy[likedUser]
    if (curUserLiked == null) {
        //current user has not been liked by the likedUser, add current user to likedUser's likedBy attribute
        liked.likedBy[curUser] = true
        liked.markModified('likedBy')
    } else {
        //current user has been liked by likedUser, they are now matched. add current user to
        //  likedUser's likedBy attribute
        //Add each other to matched attribute
        liked.likedBy[curUser] = true
        cur.matched[likedUser] = true
        liked.matched[curUser] = true
        liked.markModified('likedBy')
        cur.markModified('matched')
        liked.markModified('matched')
    }

    await cur.save()
    await liked.save()
    return cur
}
