const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')
const { SECRET } = require('../constants')
const { randomBytes } = require('crypto')
const { sign } = require('jsonwebtoken')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,

    resetPasswordToken: String,

    resetPasswordExpiresIn: Date,

    images: {
      type: Array,
      default: {
        url: 'https://via.placeholder.com/468x400?text=User%20image',
        public_id: Date.now(),
      },
    },

    about: String,

    banned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  let user = this

  //if password was changed
  if (user.isModified('password')) {
    user.password = await hash(user.password, 10)
  }

  //if user is new generate verification code
  if (user.isNew) {
    user.verificationCode = randomBytes(20).toString('hex')
  }

  next()
})

UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password)
}

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = randomBytes(20).toString('hex')
  this.resetPasswordExpiresIn = Date.now() + 3600000
}

UserSchema.methods.generateJWT = async function () {
  let payload = {
    username: this.username,
    email: this.email,
    id: this._id,
  }
  return await sign(payload, SECRET)
}

const User = model('User', UserSchema)
module.exports = User
