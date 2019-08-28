const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const User = require('../../models/User')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { SECRET_KEY, TOKEN_EXPIRES } = require('../../config')

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: TOKEN_EXPIRES })
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid} = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })

      if(!user) {
        const msg = 'User not found'
        errors.general = msg
        throw new UserInputError(msg, { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if(!match) {
        const msg = 'Wrong credentials'
        errors.general = msg
        throw new UserInputError(msg, { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register(
      _,
      {
        registerInput: {username, email, password, confirmPassword }
      },
      context,
      info
    ) {

      // Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if(!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // Make sure user doesnt already exist
      const user = await User.findOne({ username })
      if(user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date()
      })

      const result = await newUser.save()
      const token = generateToken(result)

      return {
        ...result._doc,
        id: result._id,
        token
      }
    }//,
    //async createPost
  }
}