require('dotenv').config()
const { app } = require('./index')
const mongoose = require('mongoose')
var keys = require('./config/keys')
require('./model/User.model')
require('./model/Messages.model')
require('./model/Contact.model')




console.log("hello")
const server = app.listen(5000, () => { console.log("app is running on port 5000") })

process.on("SIGINT", () => {
    server.close((err) => { console.log(err.message) })
    mongoose.disconnect()

})