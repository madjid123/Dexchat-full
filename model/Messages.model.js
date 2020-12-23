const mongoose = require('mongoose')


var messagesSchema = new mongoose.Schema({
    messageRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MessageRoom",
        required: Boolean


    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: Boolean


    },
    Message: {
        type: String,
        required: Boolean
    }

})



module.exports = mongoose.model('Messages', messagesSchema)