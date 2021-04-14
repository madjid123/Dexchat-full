const mongoose = require('mongoose')

const ContactSide = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true }
})

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: Boolean
    },
    firstSide: {
        type: ContactSide, required: true
    },
    SecondSide: {
        type: ContactSide, required: true
    }


})



module.exports = mongoose.model('Contact', ContactSchema)