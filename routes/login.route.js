

const app = require('express').Router();
const sha256 = require('js-sha256')
const User = require('../model/User.model')
app.post('/login', (req, res, next) => {
    if (!req.body) res.json("email and password must be provided")
    var { email, password } = req.body
    password = sha256(password)
    User.findOne({ email, password }, (err, result) => {
        if (err) console.log(err)
        if (result) {
            if (email == result.email && password == result.password) {
                res.json({ err: false, msg: "Loged in successfully", name: result.name })
            }
        } else {
            res.json({ err: true, msg: "there is no  such user matching this information" })
        }
    })
    res.json("dklfj")
})
module.exports = app

