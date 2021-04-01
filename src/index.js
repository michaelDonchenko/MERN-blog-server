const express = require('express')
const cors = require('cors')
const app = express()
const { PORT } = require('./constants')
const connectDB = require('./database')

//init middlewares
app.use(express.json({ limit: '5mb' }))
app.use(cors())

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
