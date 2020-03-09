const express = require('express')
const Product = require('../models/product')

const router = new express.Router()

router.post('/add-product', async(req, res) => {
    //res.send(req.body)
    try {
        const product = new Product(req.body)
        await product.save()
        res.send(product)
    }catch(e) {
        res.send(e.message)
    }
})

module.exports = router