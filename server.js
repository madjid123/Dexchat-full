require('dotenv').config()

const { app } = require('./index')
const mongoose = require('mongoose')

var keys = require('./config/keys')

require('./model/User.model')
require('./model/Messages.model')
require('./model/Contact.model')
const https = require('http')




const server = app.listen(5000, () => { console.log("app is running on port 5000") })
const Server = https.createServer(app)

const io = require('socket.io')(Server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    socket.emit("hello", "madjid")
})
io.listen(5001)
process.on("SIGINT", () => {
    server.close((err) => { console.log(err.message) })
    mongoose.disconnect()

})