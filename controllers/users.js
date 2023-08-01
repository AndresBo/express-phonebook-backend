const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// GETs all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// POSTs a new user
usersRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    // find user trying to delete document
    const user = await User.findById(decodedToken.id)
    // check if user is admin
    if (!user.admin) {
      return response.status(401).json({ error: 'user unauthorized to create users' })
    }

    const { username, name, password, admin } = request.body
    // Check password given. This is different from the passwordHash that is saved to db and
    // why not to check restrictions using mongoose validations in user schema.
    if (!password) {
      return response.status(400).json({ error: 'password is required' })
    } else if (password.length < 3) {
      return response.status(400).json({ error: 'password must be longer than 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash,
      admin: admin || false
    })

    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

// // DELETE user
// usersRouter.post('/:id', async (request, response, next) => {
  
// })

module.exports = usersRouter
