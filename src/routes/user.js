const express = require('express')
const User = require('../models/user')
//const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', async (req, res) => {
   //res.send('hellooooo')
   res.render("welcome")
})

module.exports = router