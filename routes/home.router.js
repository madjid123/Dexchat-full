require('dotenv').config()
const app = require('express').Router()

const expressSession = require('express-session')({
    secret: process.env.SESSION_TOKEN,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000000000,

    }
})

app.use(expressSession)


module.exports = app