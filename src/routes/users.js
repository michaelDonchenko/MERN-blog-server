const { Router } = require('express')
const { register, verifyAccount, login } = require('../controllers/users')
const { userAuth } = require('../middlewares/auth-middleware')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const {
  registerValidation,
  loginValidation,
} = require('../validators/user-validators')

const router = Router()

//register
router.post('/register', registerValidation, validationMiddleware, register)

//verify user
router.get('/verify-account/:verificationCode', verifyAccount)

//login
router.post('/login', loginValidation, validationMiddleware, login)

//protected
router.get('/protected', userAuth)

module.exports = router
