require('dotenv').config()
const app = require('./index')
const mongoose = require('mongoose')
require('./model/User.model')
require('./model/Messages.model')
require('./model/MessageRoom.model')


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, skipCache: true }, (err) => {
    if (err) console.log("mongoose ERR : ", err.message)

    console.log("Connected to : ", process.env.DATABASE)

})

console.log("hello")
app.listen(5000, () => { console.log("app is running on port 3000") })