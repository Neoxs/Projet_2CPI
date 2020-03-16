//require needed modules
const express = require('express')
const path = require('path')
const edge = require('express-edge')
const bodyParser = require("body-parser")
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

require('custom-env').env()

const app = express()


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')


// Setup edge engine and views location
app.set('view engine', 'edge-express')
app.use(edge.engine)
app.set('views', viewsPath)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// requiring Mongoose config
require('./config/mongoose')
const store =  new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
})


// Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store // u will find store variable on config/mongoose
  })
)

// Routes
const userRoute = require('./routes/user')
//const adminRoute = require('./routes/admin')


// Setup port
const port = process.env.PORT || 3000

// Registering routers
app.use(express.json())
app.use(userRoute)
//app.use(adminRoute)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
