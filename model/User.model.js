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

    },
    googleId: {
        type: String
    }
}, { timestamps: true })




module.exports = mongoose.model('User', userSchema)