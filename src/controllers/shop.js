const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const mongoose = require('mongoose')
const uniqid = require('uniqid')


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
}

exports.postOrder = async (req, res) => {
   let user = new User(req.session.user)
   try {
      user = await user.populate('cart.items.productId').execPopulate()
      const products = user.cart.items.map(i => {
         return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      //console.log(user)
      const order = new Order({
         user: {
            name: req.session.user.username,
            userId: req.session.user._id
         },
         products: products,
         orderId: uniqid('Agora-')
      })
      await order.save()
      req.session.user.cart.items = []
      await req.session.save()
      res.send(order)
   }catch(err){
      console.log(err.message)
      res.status(400).send(err.message)
   }
}

exports.getOrders = async (req, res) => {
   try {
      const orders = await Order.find({ "user.userId": req.session.user._id.toString() })
      res.send(orders)
   } catch(err){
      res.status(400).send(err.message)
   }
}

exports.postSearch = async (req, res) => {
   try {
      //const { category, minPrice, maxPrice } = req.body
      const category = req.body.category || ""
      const minPrice = req.body.minPrice || 0
      const maxPrice = req.body.maxPrice || 1000

      const results = await Product.find({
         category: category,
         price: { $gt: minPrice, $lt: maxPrice }
      })
      res.send(results)
   }catch(err){
      console.log(err.message)
      res.status(400).send(err.message)
   }
}
