const Product = require('../models/product')
const User = require('../models/user')


exports.getHome = async (req, res) => {
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
}

exports.getProduct = async (req, res) => {
    try {
       const prodId = req.params.productId
       const product = await Product.findById(prodId)
       res.send(product)
    }catch(e) {
       res.status(400).send(e.message)
    }
}

exports.postCart = async(req,res) => {
   const prodId = req.body.productId
   try {
      const product = await Product.findById(prodId)
      const user = new User(req.session.user)
      console.log(user)
      req.session.user = user.addToCart(product)
      await req.session.save()
      res.send(req.session.user)
   }catch(e){
      console.log(e.message)
      res.status(400).send(e.message)
   }
}

exports.getCart = async(req,res) => {
   let user = new User(req.session.user)
   try {
      user = await user.populate('cart.items.productId').execPopulate()
      const products = user.cart.items
      console.log(user)
      res.send(products)
   }catch(err){
      console.log(err.message)
      res.status(400).send(err.message)
   }
   // user
   //    .populate('cart.items.productId')
   //    .execPopulate()
   //    .then(user => {
   //       const products = user.cart.items
   //       console.log(user)
   //       res.send(products)
   //    })
   //    .catch(err => res.send(err.message))   
}
