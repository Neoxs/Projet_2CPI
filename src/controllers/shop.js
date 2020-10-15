const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const Category = require('../models/category')
const mongoose = require('mongoose')
const uniqid = require('uniqid')
const {generatePDF} = require('../helpers/pdf')
const path = require('path');


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
       res.render('shop.productDetails', {
         path: '/products',
         pageTitle: 'Product Details',
         product,
         isAuthenticated: req.session.isAuthenticated
      })
    }catch(e) {
       res.status(400).send(e.message)
    }
}

exports.getSearch = async (req, res) => {
   try {
      // Extracting query data
      const { query, min ,max } = req.query
      const categories = await Category.find({})

      // Fetching search results

      const category = query || /.*/
      const minPrice = min || 0
      const maxPrice = max || 1000

      const results = await Product.find({
         category: { $regex: category, $options: 'i' },
         price: { $gt: minPrice, $lt: maxPrice }
      })
      
      //const products = await Product.find({})
      res.render('shop.products', {
         path: '/products',
         pageTitle: 'Products',
         products: results,
         categories,
         isAuthenticated: req.session.isAuthenticated
      })

   }catch(e) {
      res.send(e.message)
   }
}

exports.postCart = async(req,res) => {
   const prodId = req.body.productId
   const quantity = parseInt(req.body.quantity)
   //console.log(prodId)
   try {
      const product = await Product.findById(prodId)
      const user = new User(req.session.user)
      //console.log(user)
      //console.log(quantity)
      req.session.user = user.addToCart(product, quantity)
      await req.session.save()
      res.redirect('/cart')
   }catch(e){
      console.log(e.message)
      res.status(400).send(e.message)
   }
}

exports.removeFromCart = async(req,res) => {
   const prodId = req.params.productId
   //console.log(prodId)
   try {
      const product = await Product.findById(prodId)
      const user = new User(req.session.user)
      //console.log(user)
      //console.log(quantity)
      req.session.user = user.removeFromCart(product)
      await req.session.save()
      res.redirect('/cart')
   }catch(e){
      console.log(e.message)
      res.status(400).send(e.message)
   }
}

exports.getCart = async(req,res) => {
   let user = new User(req.session.user)
   try {
      user = await user.populate('cart.items.productId').execPopulate()
      const items = user.cart.items
      //console.log(items[0])
      const prices = items.map(item => item.productId._doc.price * item.quantity)
      //console.log(prices)
      let total
      if (prices.length > 0) {
         total = prices.reduce((accumulator, currentValue) => accumulator + currentValue)
      } else {
         total = 0
      }
   
      res.render('shop.checkout', {
         path: '/cart',
         pageTitle: 'Cart',
         items,
         todayDate: Date.now(),
         total,
         isAuthenticated: req.session.isAuthenticated
      })
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

      let total = 0

      products.forEach(prod => {
         //console.log(prod.quantity)
         const price =  prod.product.price
         const qnt = prod.quantity
         //console.log(parseInt(prod.quantity) * parseInt(prod.product.price))
         if(prod.quantity && prod.product.price) {
            total += qnt * price
         } 
            
      });

      //console.log(total)
      const order = new Order({
         user: {
            name: req.session.user.username,
            userId: req.session.user._id
         },
         shippingInfo: {
            phone: req.body.phone,
            street: req.body.street,
            town: req.body.town,
            date: req.body.date ? new Date(req.body.date) : null
         },
         items: products,
         orderId: uniqid.time('AGORA-'),
         total: req.body.street && req.body.town ? parseInt(total) + 100 : parseInt(total)
      })
      await order.save()
      //console.log(order)
      req.session.user.cart.items = []
      await req.session.save()
      // const pdf = await generatePDF(order)
      // res.writeHead(200, {
      //    'Content-Type': 'application/pdf',
      //    'Access-Control-Allow-Origin': '*',
      //    'Content-Disposition': 'attachment; filename=bon.pdf'
      // });
      // pdf.pipe(res)
      const date = new Date(order.createdAt)
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      order.date = day + '/' + month + '/' + year


      res.render('shop.confirmation', {
         path: '/checkout',
         pageTitle: 'Checkout',
         order,
         items: order.items,
         isAuthenticated: req.session.isAuthenticated
      })
   }catch(err){
      console.log(err.message)
      res.status(400).send(err.message)
   }
}

exports.getPDF = async (req, res) => {
   const user = new User(req.session.user)
   //console.log(user)
   const lastOrder = await Order.findOne({ "user.userId": req.session.user._id.toString() }).sort({createdAt: -1})
   
   const pdf = await generatePDF(lastOrder)
   res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=bon.pdf'
   });
   pdf.pipe(res)
}

exports.getOrders = async (req, res) => {
   try {
      const orders = await Order.find({ "user.userId": req.session.user._id.toString() })
      res.send(orders)
   } catch(err){
      res.status(400).send(err.message)
   }
}
