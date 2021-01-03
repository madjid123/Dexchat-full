
require('dotenv').config()
var express = require('express')
var app = express()
var keys = require('./config/keys')
const fs = require('fs')

const mongoose = require('mongoose')
const passport = require('passport')
require('./config/Passport')(passport)

const expressSession = require('express-session')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport, () => { })

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to mongodb atlas ")

})


app.use(passport.initialize())
app.use(passport.session())

app.use(require('cors')({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true // enable set cookie
}))


app.use('/', require('./routes/register.route'))
// fs.readdir('./routes', (err, files) => {
//     files.filter(file => {
//         file = file.slice(0, file.length - 3)
//         app.use('/', require('./routes/' + file))
//         app.use(require('./routes/' + file))
//     })
// })

app.get('/', (req, res) => {
    console.log(req.session)
    console.log(req.user)
    if (req.user) console.log(req.user)
    res.json("Welcome " + (req.session.user === undefined) ? "" : `${req.session.user}`)
})
app.get('/auth/google/logout', (req, res) => {
    console.log(req.user)

    req.session.destroy(function (e) {
        req.logOut()
        req.logout();
        res.redirect('/');
    });

})

app.get('/loggedin', (req, res, next) => {

    if (req.session) {
        let name = ""
        if (req.session.user) name = req.session.user
        else {
            User.find
        }
        res.json({ name: name })
    }
    else {
        res.json({ err: true, msg: "Not logged in" })
    }
})
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}), (req, res) => {

});

app.get("/auth/google/redirect", (req, res) => {

    res.redirect("/")
})
app.get("/failedGoogleLogin", (req, res) => {
    res.json("Failed to login using google")

})
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failedGoogleLogin' }),
    function (req, res) {

        res.redirect('/');
    });
const Router = express.Router()


app.use(Router)

module.exports = { app, db: mongoose }