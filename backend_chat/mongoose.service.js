const mongoose = require('mongoose')
const uri = "mongodb+srv://meetUT:meetUT@chat.3mmja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connect = () => {
    mongoose.connect(uri).then(() => {

    }).catch(err => {
        console.log(err)
    })
}

connect()

exports.mongoose = mongoose
