const mongoose = require('mongoose')


const messageRoomSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: Boolean
    }
})



module.exports = mongoose.model('MessageRoom', messageRoomSchema)