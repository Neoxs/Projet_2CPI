const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    products: [
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
            red: 'User'
        }
    }
})


module.exports = mongoose.model('Order', orderSchema)