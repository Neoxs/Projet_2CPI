const mongoose = require('mongoose')

const orderSchema = new orderSchema({
    products: [
        {
            product: { type: Object, required: true },
            quality: { type: Number, required: true }
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

module.exports = mongoode.model('Order', orderSchema)