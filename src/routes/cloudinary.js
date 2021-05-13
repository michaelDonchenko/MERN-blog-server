const { Router } = require('express')
const {
  uploadImage,
  deleteImage,
  setProfileImage,
} = require('../controllers/cloudinary')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/upload-image', userAuth, uploadImage)
router.post('/delete-image', userAuth, deleteImage)
router.post('/set-profile-image', userAuth, setProfileImage)

module.exports = router
