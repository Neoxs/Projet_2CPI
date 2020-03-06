const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    password: {
        type: Number,
        required: true,
        trim: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User