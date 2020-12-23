const mongoose = require('mongoose')


const messageRoomSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: "name is required",

    }

})



module.exports = mongoose.model('messageRoom', messageRoomSchema)