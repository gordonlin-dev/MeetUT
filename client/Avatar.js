const avatarMap = require('./Avatars.json')

exports.getAvatar = (id) => {
    let str_id;
    try{
        str_id = id.toString()
    } catch (e) {
        str_id = "0"
    }
    switch (str_id) {
        case "1":
            return require("./assets/Avatars/avocado-cartoon.jpeg");
        case "2":
            return require("./assets/Avatars/grape-cartoon.jpg")
        case "3":
            return require("./assets/Avatars/strawberry-cartoon.jpeg")
        case "4":
            return require("./assets/Avatars/lemon-cartoon.jpeg")
        case "5":
            return require("./assets/Avatars/pear-cartoon.jpeg")
        case "6":
            return require("./assets/Avatars/orange-cartoon.png")
        default:
            return require("./assets/Avatars/apple-cartoon.png")
    
    
    }
}