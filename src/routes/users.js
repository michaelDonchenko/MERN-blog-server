const { Router } = require('express')
const { register, verifyAccount } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const { registerValidation } = require('../validators/user-validators')

const router = Router()

//register
router.post('/register', registerValidation, validationMiddleware, register)

//verify user
router.get('/verify-account/:verificationCode', verifyAccount)

module.exports = router
