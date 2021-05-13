const cloudinary = require('cloudinary')
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require('../constants')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

//upload image
exports.uploadImage = async (req, res) => {
  let { image } = req.body
  let user = req.user

  if (!image) {
    return res
      .status(400)
      .json({ message: 'Please choose an image to upload', success: false })
  }

  if (user.images.length >= 5) {
    return res
      .status(400)
      .json({ message: 'Cannot upload more than 5 images', success: false })
  }
  try {
    cloudinary.uploader.upload(image, async (result) => {
      let { public_id, secure_url } = result
      let newImage = { public_id, url: secure_url }

      await user.images.unshift(newImage)

      await user.save()
      let imagesArray = user.images

      return res.status(201).json({
        imagesArray,
        success: true,
        message: 'Image was uploaded succefully',
      })
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//delete image
exports.deleteImage = async (req, res) => {
  let { public_Id } = req.body
  let user = req.user

  //if the client do not send public id
  if (!public_Id) {
    return res
      .status(400)
      .json({ message: 'Could not find the image', success: false })
  }

  try {
    cloudinary.uploader.destroy(public_Id, async ({ result }) => {
      //if cloudinary deleted the image
      if (result === 'ok') {
        let filtered = await user.images.filter(
          (image) => image.public_id !== public_Id
        )

        user.images = filtered
        await user.save()

        let imagesArray = user.images
        return res
          .status(201)
          .json({ imagesArray, success: true, message: 'Deleted succefully' })
      }

      return res
        .status(400)
        .json({ message: 'Could not delete the image', success: false })
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//set profile image
exports.setProfileImage = async (req, res) => {
  let { public_id } = req.body
  let user = req.user

  if (!public_id) {
    return res
      .status(400)
      .json({ message: 'Could not find the image', success: false })
  }

  try {
    let filtered = await user.images.filter(
      (image) => image.public_id !== public_id
    )

    let profileImage = await user.images.filter(
      (image) => image.public_id === public_id
    )

    user.images = filtered

    user.images.unshift(profileImage[0])

    await user.save()

    let imagesArray = user.images
    return res.status(200).json({
      imagesArray,
      success: true,
      message: 'Profile picture was set succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
