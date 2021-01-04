
const app = require('./home.router')
const passport = require('passport')
const sha256 = require('js-sha256')
const User = require('../model/User.model')


app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/loggedin',
        failureRedirect: '/login',
        failureFlash: true
    }, (err, user, info) => {
        if (err) console.log(err)
        if (!user)
            return res.status(200).json(info.message)
        else {
            console.log(user)
            req.login(user, err => { console.log(err) })
            res.redirect('/loggedin')
        }

    })(req, res, next)
})




// if (!req.body || !req.body.email || !req.body.password) return res.json("email and password must be provided")
// var { email, password } = req.body
// password = sha256(password)
// User.findOne({ email, password }, (err, result) => {
//     if (err) {
//         console.log(err)
//         res.json({ err: true, msg: "Connection with db timed out" })
//     }
//     if (result) {

//         req.session.user = result.name

//         res.json({ err: false, msg: "Loged in successfully", name: result.name })

//     } else {
//         res.json({ err: true, msg: "there is no  such user matching this information" })
//     }
// })


app.get('/login', (req, res, next) => {
    res.json("ldsjfld")
})
app.get('/logout', (req, res, next) => {
    req.session.destroy()
    console.log("loggedout")
    req.logout()

    res.json("logged out successfully")
})

module.exports = app

