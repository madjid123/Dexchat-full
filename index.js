
require('dotenv').config()
var express = require('express')
var app = express()
var keys = require('./config/keys')
const fs = require('fs')

const mongoose = require('mongoose')
const passport = require('./config/Passport')
const expressSession = require('express-session')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to mongodb atlas ")

})

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
    res.json("Welcome " + (req.session.user === undefined) ? "" : `${req.session.user}`)
})

app.get('/loggedin', (req, res, next) => {

    if (req.session.user)
        res.json(req.session.user)
    else {
        res.json({ err: true, msg: "Not logged in" })
    }
})
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });
const Router = express.Router()


app.use(Router)

module.exports = { app, db: mongoose }