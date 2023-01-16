const getConnectionString = () => {
    if(process.env.Connection_String){
        return process.env.Connection_String
    }else{
        return ""
    }
}

const getJWTSecret = () => {
    if(process.env.JWT_Secret){
        return process.env.JWT_Secret
    }else{
        return ""
    }
}
module.exports = {
    "jwt_secret" : getJWTSecret(),
    "jwt_expiration_in_hours": "24h",
    "connection_string": getConnectionString()
}
