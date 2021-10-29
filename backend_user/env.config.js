const getConnectionString = () => {
    if(process.env.Connection_String){
        return process.env.Connection_String
    }else{
        return "mongodb+srv://meetUT:meetUT@cluster0.cwotf.mongodb.net/Cluster0?retryWrites=true&w=majority"
    }
}

module.exports = {
    "jwt_secret" : "E48B0EE5E3988AE0018054A207E34CF818FDB5BC10CBCEDE41F46D28857A7654",
    "jwt_expiration_in_hours": 6,
    "connection_string": getConnectionString()
}
