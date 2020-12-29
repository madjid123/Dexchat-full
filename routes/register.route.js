const app = require('./login.route')
const user = require('../model/User.model')
const { sha256 } = require("js-sha256")
app.route('/register').post((req, res, next) => {

    if (req.session.user) res.json({ err: true, msg: "you must logout" })
    if (!req.body) res.status(404).json({ err: "true", msg: " no data received ! " })

    const { name, email, password } = req.body

    user.findOne({ name, email, password }, (err, person) => {
        console.log(person)
        if (person != null && (person.name === name || person.email === email)) {

            res.json({ err: true, msg: "User already exist" })
        } else {
            var newUser = new user({ name, email, password: sha256(password) })
            newUser.save()
            res.json({ err: false, msg: "User successfully created", name: name })
        }
    }
    )
})



const Register = app

module.exports = Register
