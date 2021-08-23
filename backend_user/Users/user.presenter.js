exports.invalidUser = (reason) => {
    if (reason === "exist") {
        return {error: "User already exists"}
    } else if (reason === "null") {
        return {error: "User does not exist"}
    }
}

exports.updatedPassword = () => {
    return {result: "Password updated successfully"}
}

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
    } else if (reason === "code") {
        return {error: "Verification email could not be sent, please try again."}
    }
}

exports.verificationEmail = (field, code) => {
    if (field === "subject") {
        return "Email Verification"
    } else if (field === "text") {
        return "Your verification code is " + code
    }
}


