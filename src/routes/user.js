const express = require('express')
const User = require('../models/user')
//const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', async (req, res) => {
   //res.send('hellooooo')
   res.render("welcome")
})

router.post('/register', async(req, res) => {
   console.log(req.body)
   //const user = new User(req.body)
   res.send(req.body)
})

module.exports = router