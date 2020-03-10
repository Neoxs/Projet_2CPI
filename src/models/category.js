const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    }
})

categorySchema.statics.findAll = async () => {
    const Categories = await Category.find({})
    if(!Categories){
        throw new Error('Unable to perform task !')
    }
    
    return Categories
}

const Category = mongoose.model('Category', categorySchema)

module.exports = Category