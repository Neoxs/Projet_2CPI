//require needed modules
const express = require('express')
const path = require('path')
const edge = require('express-edge')
const bodyParser = require("body-parser")
const session = require('express-session')


const MongoDBStore = require('connect-mongodb-session')(session)

//require routes
const userRoute = require('./routes/user')

//Requiring env variables
require('custom-env').env()

//Connecting to the database
require('./config/mongoose')

//MongoDBStore store object
const store =  new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
})

//create the express app
const app = express()

//Defining paths for Express
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')

//Set up public files directory
app.use(express.static(publicDirectoryPath))

//Set up edge engine and views directory
app.set('view engine', 'edge-express')
app.use(edge.engine)
app.set('views', viewsPath)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store // u will find store variable on config/mongoose
  })
)
  
//Registering routes
app.use(userRoute)
  
//Set up port
const port = process.env.PORT || 3000


//listening to requests
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
