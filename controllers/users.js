const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
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

  const user = new User({
    username,
    name,
    passwordHash,
    admin: admin || false
  })
  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch(error) {
    next(error)
  }
})

module.exports = usersRouter
