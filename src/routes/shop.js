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

//Remove item from Cart
router.get('/cart/:productId', isAuth, shopController.removeFromCart)

//Creating an order
router.post('/create-order', isAuth, shopController.postOrder)

//Fetchig the orders
router.get('/orders', isAuth, shopController.getOrders)

//searching for products
router.get('/products', shopController.getSearch)

//searching for products
router.post('/products', shopController.postSearch)

module.exports = router