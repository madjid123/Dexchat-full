
var express = require('express')
var app = express()
var keys = require('./config/keys')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('./config/Passport')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to mongodb atlas ")

})

app.use(require('cors')())

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