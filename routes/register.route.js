const app = require('express').Router()
const user = require('../model/User.model')
const { sha256 } = require("js-sha256")
app.route('/register').post((req, res, next) => {
    console.log(req.body)
    const { name, email, password } = req.body
    user.findOne({ name, email, password }, (err, person) => {
        console.log(person)
        if (person != null && (person.name === name || person.email === email)) {

            res.json({ err: true, msg: "User already exist" })
        } else {
            var newUser = new user({ name, email, password: sha256(password) })
            newUser.save()
            res.json({ err: false, msg: "User successfully created" })
        }
    }
    )
})
app.get('/register', (req, res, next) => {
    res.json("kdjf")
})
const Register = app

module.exports = Register
