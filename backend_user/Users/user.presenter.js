const cfg = require("./user.config.json")

exports.invalidPassword = (reason) => {
    if (reason === "length") {
        return {error: "Password must be between 8 and 50 characters long"}
    } else if (reason === "match") {
        return {error: "Passwords do not match"}
    }
}

exports.invalidEmail = (reason) => {
    if (reason === "address") {
        return {error: "Email must be valid"}
    } else if (reason === "domain") {
        return {error: "Email must belong to University of Toronto"}
    }
}



