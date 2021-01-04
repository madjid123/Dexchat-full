require('dotenv').config()
const app = require('express').Router()



app.get('/', (req, res) => {


    res.json("Welcome " + (req.session.passport.user.name === undefined) ? "" : `${req.session.user}`)
})


module.exports = app