const mongoose = require('mongoose')

const totalSchema = new mongoose.Schema({
    totalearnings: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('Total', totalSchema)