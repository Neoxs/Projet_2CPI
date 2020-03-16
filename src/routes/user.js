const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const isnAuth = require('../middlewares/isAuth')
const authController = require('../controllers/auth')
const router = new express.Router()


// getting welcome "home" page and rendering the latest products on it
router.get('/', async (req, res) => {
   try {
      //const products = await Product.find({})
      res.render('welcome', {
         path: '/',
         pageTitle: 'Home',
         isAuthenticated: req.session.isAuthenticated
      })

   }catch(e) {
      res.send(e.message)
   }
})

// getting product details
router.get('/product/:productId', async (req, res) => {
   try {
      const prodId = req.params.productId
      const product = await Product.findById(prodId)
      res.send(product)
   }catch(e) {
      res.send(e.message)
   }
})

//Rendering register view
router.get('/register', isnAuth, authController.getSignup)

//Register
router.post('/register', isnAuth, authController.postSignup)

// Login
router.get('/login', isnAuth, authController.getLogin);

router.post('/login', isnAuth, authController.postLogin)
 
// Logout
router.post('/logout', authController.postLogout)

router.post('/cart', async(req,res) => {
   const prodId = req.body.productId
   try {
      const product = await Product.findById(prodId)
      await req.user.addToCart(product)
   }catch(e){
      console.log(e.message)
   }
})

module.exports = router