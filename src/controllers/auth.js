const User = require('../models/user')

exports.getSignup = (req, res) => {
    res.render("auth/register", {
        pageTitle: "register",
        path: '/register',
        isAuthenticated: req.session.isAuthenticated
    })
}

exports.postSignup = async(req, res) => {
    const { username, email, password, confirmPassword } = req.body
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
 
}

exports.getLogin = (req, res) => {
    res.render("auth/login", {
       path: '/login',
       pageTitle: 'Login',
       isAuthenticated: req.session.isAuthenticated,
       user: req.session.user
    })
}

exports.postLogin = async (req, res) => {
    try {
       const user = await User.findByCredentials(req.body.email, req.body.password)
       req.session.isAuthenticated = true
       req.session.user = user.toJSON()
       await req.session.save()
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
}

exports.postLogout = async(req, res) => {
    try {
        await req.session.destroy()
        res.redirect('/login')
    }catch(err) {
        console.log(err.message)
        res.redirect('/')
    }
}