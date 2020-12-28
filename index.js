
var express = require('express')
var app = express()
var keys = require('./config/keys')
const fs = require('fs')

const mongoose = require('mongoose')
const passport = require('./config/Passport')
const Register = require('./routes/register.route')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to mongodb atlas ")

})

app.use(require('cors')())

// app.use(Register, (res, req, next) => {
//     next();
// })

fs.readdir('./routes', (err, files) => {
    files.filter(file => {
        file = file.slice(0, file.length - 3)
        app.use('/', require('./routes/' + file))
    })
})



app.get('/', (req, res) => { res.send("<h1> hello </h1>") })

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });
const Router = express.Router()
Router.get('/sendmsg', (req, res) => { res.header("Access-Control-Allow-Origin", "*"); res.json("hello") })

app.use(Router)

module.exports = { app, db: mongoose }