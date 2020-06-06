const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        trim: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

userSchema.methods.addToCart = function (product, quantity) {
    const user = this
    //console.log(this)
    const cartProductIndex = user.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    })
    //console.log(cartProductIndex)

    let newQuantity = quantity
    const  updatedCartItems = [...user.cart.items]
    //console.log(updatedCartItems)

    if (cartProductIndex >= 0) {
        newQuantity += user.cart.items[cartProductIndex].quantity
        updatedCartItems[cartProductIndex].quantity = newQuantity
    }else{
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    user.cart = updatedCart
    return user
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User