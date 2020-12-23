const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: Boolean
    },
    email: {
        type: String,
        required: Boolean
    },
    password: {
        type: String,
        required: Boolean
    }
}, { timestamps: true })




module.exports = mongoose.model('User', userSchema)