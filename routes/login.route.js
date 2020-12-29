
const app = require('./home.router')

const sha256 = require('js-sha256')
const User = require('../model/User.model')


app.post('/login', (req, res, next) => {
    if (!req.body) res.json("email and password must be provided")
    var { email, password } = req.body
    password = sha256(password)
    User.findOne({ email, password }, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ err: true, msg: "Connection with db timed out" })
        }
        if (result) {
            if (email == result.email && password == result.password) {
                req.session.user = result.name
                console.log(req.session)
                res.json({ err: false, msg: "Loged in successfully", name: result.name })
            }
        } else {
            res.json({ err: true, msg: "there is no  such user matching this information" })
        }
    })

})
app.get('/login', (req, res, next) => {
    res.json("ldsjfld")
})
app.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.json("logged out successfully")
})

module.exports = app

