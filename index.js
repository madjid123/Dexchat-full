
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const { model } = require('mongoose')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => { res.send("<h1> hello </h1>") })







module.exports = app