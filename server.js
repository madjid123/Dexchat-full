require('dotenv').config()
const app = require('./index')
const mongoose = require('mongoose')
var keys = require('./config/keys')
require('./model/User.model')
require('./model/Messages.model')
require('./model/MessageRoom.model')



mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to mongodb atlas ")

})

console.log("hello")
const server = app.listen(5000, () => { console.log("app is running on port 3000") })

process.on("SIGINT", () => {
    server.close((err) => { console.log(err.message) })
    mongoose.disconnect()

})