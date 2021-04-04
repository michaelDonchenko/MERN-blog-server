const User = require('../models/User')
const { sendMail } = require('./mail-sender')

exports.register = async (req, res) => {
  try {
    //send mail to the user
    sendMail()
    //save the user to the database
    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
