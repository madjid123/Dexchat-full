
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const { model } = require('mongoose')
const passport = require('./config/Passport')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => { res.send("<h1> hello </h1>") })

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });




module.exports = app