const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
//const auth = require('../middleware/auth')
const router = new express.Router()


// getting welcome "home" page and rendering the latest products on it
router.get('/', async (req, res) => {
   try {
      const products = await Product.find({})
      res.render('welcome', {
         products: products,
         pageTitle: 'Home'
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

// rendering register view
router.get('/register', async (req, res) => {
   res.render("auth/register", {
      pageTitle: "register"
   })
})

router.post('/register', async(req, res) => {
   console.log(req.body)
   const user = new User(req.body)

   try {
      await user.save()
      res.status(201).send(user)
   } catch(e) {
      console.log(e.message)
      res.status(400).send()
   }
})

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