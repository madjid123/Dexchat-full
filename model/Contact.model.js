const mongoose = require('mongoose')


const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: Boolean
    },
    firstSide: {
        type: String, required: Boolean
    },
    SecondSide: {
        type: String, required: Boolean
    }


})



module.exports = mongoose.model('Contact', ContactSchema)