const express = require('express')
var AdminController = require('../controllers/AdminController')

const router = new express.Router()

router.get('/admin_register',(req,res)=>{return res.render('admin/index')})

router.post('/admin_register',AdminController.register)

router.get('/admin_login',(req,res)=>{ return  res.render('admin/login')})

router.post('/admin_login',AdminController.login);

router.get('/admin', AdminController.access)

router.get('/admin/logout',AdminController.logout)

router.post('/admin/:prms',AdminController.productsChange)  //get data from froms and search input

router.post('/admin',AdminController.getOrder);

router.get('/admin/delete/:id',AdminController.delete)

// make route accessible to other files
module.exports = router;