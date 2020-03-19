const express = require('express')
const router = new express.Router()

const isAuth = require('../middlewares/isAuth')

const shopController = require('../controllers/shop')

//getting welcome "home" page and rendering the latest products on it
router.get('/', shopController.getHome)

//getting product details
router.get('/product/:productId', shopController.getProduct)

//adding to product to cart
router.post('/cart', isAuth, shopController.postCart)

//Loading the cart
router.get('/cart', isAuth, shopController.getCart)

router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders)

module.exports = router