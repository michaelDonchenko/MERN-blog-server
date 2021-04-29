const User = require('../models/User')
const { sendMail } = require('./mail-sender')
const { SERVER_URL } = require('../constants')
const _ = require('lodash')

//register new user
exports.register = async (req, res) => {
  const { username, email } = req.body
  try {
    //save the user to the database
    let user = new User({
      ...req.body,
    })

    await user.save()

    //send mail to the user
    const emailData = {
      subject: 'Verify your account',
      textPart: 'Verify your account',
      htmlPart: `
      <h1>Hello ${username},</h1>
      <h2>Welcome to Mike's blog!</h2>
      <p>Please click the following link to verify your account</p>
      <a href="${SERVER_URL}/api/verify-account/${user.verificationCode}">Verify Account</a>
      `,
      costumId: 'Register verification',
    }

    const { subject, textPart, htmlPart, costumId } = emailData
    sendMail(email, username, subject, textPart, htmlPart, costumId)

    //send success response to the user
    res.status(200).json({
      success: true,
      message: `The registration was succefull, please check your mailbox at ${user.email} in order to verify your account.`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//verify account
exports.verifyAccount = async (req, res) => {
  const { verificationCode } = req.params
  try {
    let user = await User.findOne({ verificationCode })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      })
    }

    //if the verification code is ok
    user.verificationCode = undefined
    user.verified = true

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'The user is verified',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.login = async (req, res) => {
  try {
    let userFromDB = req.user

    //generate jwt token
    const token = await userFromDB.generateJWT()

    const user = _.pick(userFromDB, [
      '_id',
      'username',
      'email',
      'images',
      'about',
      'role',
      'verified',
      'banned',
    ])

    //send success status user and token
    return res.status(200).json({
      success: true,
      message: 'User is logged in',
      user,
      token: `bearer ${token}`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.protected = async (req, res) => {
  try {
    return res.send('protected info')
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.allUsers = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const page = req.query.page ? parseInt(req.query.page) : 1
  try {
    const users = await User.find()
      .select('_id username email images about role verified banned')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await User.find().countDocuments()

    if (!users) {
      return res.status(404).json({
        success: false,
        message: 'Could not find users',
      })
    }

    return res.status(200).json({
      success: true,
      users: users,
      count: count,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.updateDetails = async (req, res) => {
  const { username, about } = req.body
  const id = req.user._id
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, about },
      { new: true }
    )

    return res.status(201).json({
      success: true,
      user,
      message: 'Details updated succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
