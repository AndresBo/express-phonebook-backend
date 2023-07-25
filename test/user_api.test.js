const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// use supertest package that helps write test for testing the API
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

// wrap express application from app.js with supertest function to form 'superagent' object
const api = supertest(app)

describe('when there is initially one user in db', () => {
  // populate db before each test in this group of tests
  beforeEach(async () => {
    await User.deleteMany({})
    // create a new user
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'test', passwordHash, name: 'test', admin: false })

    await user.save()
  })

  test('creation succeeds with a new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Mario',
      name: 'Mario Mario',
      password: 'peach',
      admin: false
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('users at start', usersAtStart)
    const newUser = {
      username: 'test',
      name: 'test',
      password: 'password',
      admin: false
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  },)
})
