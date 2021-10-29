const mongoose = require('mongoose')
const uri = require("./env.config").connection_string

const connect = () => {
    mongoose.connect(uri).then(() => {

    }).catch(err => {
        console.log(err)
    })
}

connect()

exports.mongoose = mongoose
