const { config } = require('dotenv')
config()

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  SECRET: process.env.SECRET,
  MJ1: process.env.MJ_KEY1,
  MJ2: process.env.MJ_KEY2,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}
