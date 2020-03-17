const express = require('express')
const router = new express.Router()

const isnAuth = require('../middlewares/isnAuth')

const shopController = require('../controllers/shop')

//getting welcome "home" page and rendering the latest products on it
router.get('/', shopController.getHome)

//getting product details
router.get('/product/:productId', shopController.getProduct)

//adding to product to cart
router.post('/cart', shopController.postCart)

//Loading the cart
router.get('/cart', shopController.getCart)

module.exports = router