const mongoose = require('mongoose')
//const validator = require('validator')
//const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product