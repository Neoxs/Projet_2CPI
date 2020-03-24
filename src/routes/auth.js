const express = require('express')
const router = new express.Router()

const isnAuth = require('../middlewares/isnAuth')

const authController = require('../controllers/auth')

//Rendering register view
router.get('/register', isnAuth, authController.getSignup)

//Register
router.post('/register', isnAuth, authController.postSignup)

//Login
router.get('/login', isnAuth, authController.getLogin);

router.post('/login', isnAuth, authController.postLogin)
 
//Logout
router.post('/logout', authController.postLogout)

module.exports = router