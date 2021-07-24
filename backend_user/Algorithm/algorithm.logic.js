// Maintainer: Justin Chan - csnow.to@gmail.com

example =
    {
        "User1": {
            "A1": 1,
            "A2": 2,
            "A3": 3,
            "A4": 4,
            "A5": 5,
            "A6": 6
        },
        "User2": {
            "A1": 5,
            "A2": 4,
            "A3": 8,
            "A4": 9,
            "A5": 1,
            "A6": 3
        }
    }  // Post me!

exports.calculate = (req, res) => {
    const toSum = []

    const User1 = req.body.User1
    const User2 = req.body.User2

    // Assuming both users have the same keys:
    const keys = Object.keys(User1)
    for (let key of keys) {
        let p = Number(User1[key])
        let q = Number(User2[key])
        let x = (q - p) ** 2
        // console.log("(" + q + " - " + p + ")" + "^2 = " + x)
        toSum.push(x)
    }

    let toSqrt = sum(toSum)
    let result = Math.sqrt(toSqrt)
    // console.log(result)
    res.status(201).json({result:result})
}

sum = (toSum) => {
    let sum = 0
    for (let x of toSum) {
        sum = sum + x
    }
    return sum
}
