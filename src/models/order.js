const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    createdAt: { 
        type: Date,
        default: Date.now
     },
    items: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.ObjectId,
            required: true,
            ref: 'User'
        }
    }
})


module.exports = mongoose.model('Order', orderSchema)