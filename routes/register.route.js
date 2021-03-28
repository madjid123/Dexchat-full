const app = require('./login.route')
const user = require('../model/User.model')
const { sha256 } = require("js-sha256")


app.post('/register', async (req, res, next) => {

    if (req.session.user) return res.json({ err: true, msg: "you must logout" })


    const { name, email, password } = req.body
    if (!req.body || (!name || !email || !password)) return res.json({ err: "true", msg: "You have to fill the form !" })

    const persons = await user.find({ $or: [{ "email": email }, { "name": name }] })


    if (persons.length !== 0) {

        return res.json({ err: true, msg: "User already exist" })

    }
    else {
        var newUser = new user({ name, email, password: sha256(password) })
        newUser.save()
        res.json({ err: false, msg: "User successfully created", name: name })
    }



})



const Register = app

module.exports = Register
