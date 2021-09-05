exports.unauthorized = () => {
    return {
        'Content-Type': 'application/json'
    }
}

exports.authorized = (accessToken) => {
    return {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + accessToken
    }
}