const avatarMap = require('./Avatars.json')

exports.getAvatar = (id) => {
    let str_id = id.toString()
    try {
        return avatarMap[str_id]
    } catch (e) {
        console.log(e)
        return avatarMap['0']
    }
}