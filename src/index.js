const express = require('express')
const cors = require('cors')
const app = express()
const { PORT } = require('./constants')
const connectDB = require('./database')
const passport = require('passport')

//import passport middleware
require('./middlewares/passport-middleware')

//init middlewares
app.use(express.json({ limit: '5mb' }))
app.use(cors())
app.use(passport.initialize())

//router imports
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')

//use routes
app.use('/api', userRoutes)
app.use('/api', cloudinaryRoutes)

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })

    connectDB()
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
