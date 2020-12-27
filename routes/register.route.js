const e = require('express');
const app = e.Router()
const user = require('../model/User.model')
const { sha256 } = require("js-sha256")
app.route('/register').post((req, res, next) => {
    console.log(req.body)
    res.json("hello")
})
app.get('/register', (req, res, next) => {
    res.json("kdjf")
})
const Register = app

module.exports = Register
