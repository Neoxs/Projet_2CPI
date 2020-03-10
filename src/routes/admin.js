const express = require('express')
const Product = require('../models/product')
const Category = require('../models/category')

const router = new express.Router()

router.get('/admin/dashboard', async(req, res) => {
    res.render('admin.home')
})

router.post('/admin/add-category', async(req, res) => {
    try{
        const category = Category.create(req.body)
        res.status(201).send(category)
    }catch(e){
        console.log(e.message)
    }
})

router.get('/admin/add-product', async(req, res) => {
    
        const allCategories = await Category.findAll()
        res.render('admin.addProduct', {categories: allCategories})
    
})

router.post('/admin/add-product', async(req, res) => {
    console.log(req.body)
    const allCategories = await Category.findAll()
    try {
        const product = new Product(req.body)
        await product.save()
        res.render('admin.addProduct', {categories: allCategories, success: "the product was added successfuly"})
    }catch(e) {
       res.render('admin.addProduct', {categories: allCategories, error: e.message})
    }
})

module.exports = router