const getConnectionString = () => {
    if(process.env.Connection_String){
        return process.env.Connection_String
    }else{
        return "mongodb+srv://meetUT:meetUT@chat.3mmja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    }
}

const getJWTSecret = () => {
    if(process.env.JWT_Secret){
        return process.env.JWT_Secret
    }else{
        return "wz36Yu9kywCWib68qQNZ5LVt4bqo8LuBu8PmzvNFFK9uSS67OLQQ37XToT3ZKuR"
    }
}
module.exports = {
    "jwt_secret" : getJWTSecret(),
    "jwt_expiration_in_hours": "24h",
    "connection_string": getConnectionString()
}
