const mongoose = require('mongoose')


const messagesSchema = new mongoose.Schema({
    MessageRoom: {
        $type: mongoose.Schema.$types.ObjectId,
        required: "messageRoom is required",
        ref: 'messageRoom'

    },
    User: {
        $type: mongoose.Schema.$types.objectId,
        required: "user is required",
        ref: 'user'

    },
    Message: {
        $type: String,
        required: "message is required"
    }

})



module.exports = mongoose.model('messages', messagesSchema)