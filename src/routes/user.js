const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
//const auth = require('../middleware/auth')
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

// rendering register view
router.get('/register', async (req, res) => {
   res.render("auth/register", {
      pageTitle: "register",
      path: '/register',
      isAuthenticated: req.session.isAuthenticated
   })
})

// Register
router.post('/register', async(req, res) => {
   const { username, email, password, confirmPassword } = req.body
   console.log(req.body)
   const isValid = (password === confirmPassword)

   if(!isValid) {
      res.render('auth/register', {
         pageTitle: 'Signup',
         path: '/register',
         isAuthenticated: req.session.isAuthenticated,
         error: 'Password does not match'
      })
   } else {
      delete req.body.confirmPassword
      const user = new User(req.body)

      try {
            await user.save()
            res.redirect('/login')
      } catch (e) {
            res.render('auth/register', {
               pageTitle: 'Signup',
               path: '/register',
               isAuthenticated: req.session.isAuthenticated,
               error: e.message
            })
      }
   }

})

// Login
router.get('/login', (req, res) => {
   res.render("auth/login", {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user
   })
});

router.post('/login', async (req, res) => {
   try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      req.session.isAuthenticated = true
      req.session.user = user.toJSON()
      res.redirect('/')

   }catch(e){
      res.render('auth/login', {
         path: '/login',
         pageTitle: 'Login',
         isAuthenticated: req.session.isAuthenticated,
         user: req.session,
         error: e.message
      })
   }
})
 
// Logout
router.post('/logout', async(req, res) => {
   req.session.destroy(err => {
      console.log(err)
      res.redirect('/')
   })
});

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