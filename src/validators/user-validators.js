const { check } = require('express-validator')
const User = require('../models/User')

const username = check('username')
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 2, max: 15 })
  .withMessage('Username has to be between 2 and 15 characters')

const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters')

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email')

module.exports = {
  registerValidation: [username, email, password],
}
