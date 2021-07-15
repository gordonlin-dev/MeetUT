const mongoose = require('mongoose')
const uri = "mongodb+srv://meetUT:meetUT@cluster0.cwotf.mongodb.net/Cluster0?retryWrites=true&w=majority"

const connect = () => {
    mongoose.connect(uri).then(() => {

    }).catch(err => {

    })
}

connect()

exports.mongoose = mongoose