const mongoose = require('mongoose')
const uri = require("./env.config").connection_string
console.log(uri)
const connect = () => {
    mongoose.connect(uri).then(() => {

    }).catch(err => {
        console.log(err)
    })
}

connect()

exports.mongoose = mongoose
