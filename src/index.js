// configuration
const path = require('path')
const edge = require('express-edge')
const bodyParser = require("body-parser")

// Express configuration
const express = require('express')
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')
const partialsPath = path.join(__dirname, '../views/layouts')

// Setup edge engine and views location
app.set('view engine', 'edge')
app.use(edge.engine)
app.set('views', viewsPath)
//edge.registerViews(path.join(__dirname, './views'))
//edge.registerPartials(partialsPath)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// requiring Mongoose config
require('./config/mongoose')

// Setup routers
const userRouter = require('./routes/user')


// Setup port
const port = process.env.PORT || 3000

// Registering routers
app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
