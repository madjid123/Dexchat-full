const mongoose = require('mongoose')


const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: Boolean
    },
    firstSide: {
        type: mongoose.Schema.Types.ObjectId, required: Boolean
    },
    SecondSide: {
        type: mongoose.Schema.Types.ObjectId, required: Boolean
    }


})



module.exports = mongoose.model('Contact', ContactSchema)