const { Router } = require('express')
const { register } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const { registerValidation } = require('../validators/user-validators')

const router = Router()

//register
router.post('/register', registerValidation, validationMiddleware, register)

module.exports = router
