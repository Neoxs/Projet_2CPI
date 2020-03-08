const express = require('express')
const User = require('../models/user')
//const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', async (req, res) => {
   res.render("welcome")
})

router.get('/register', async (req, res) => {
   res.render("auth/register")
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

module.exports = router