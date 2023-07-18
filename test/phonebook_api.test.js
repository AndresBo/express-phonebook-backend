const mongoose = require('mongoose')
// user supertest package that helps write test for testing the API
const supertest = require('supertest')
const app = require('../app')

// wrap express application from app.js with supertest function into a 'superagent' object
const api = supertest(app)

const helper = require('./test_helper')
const Person = require('../models/person')

// clear and initialize the database by saving two notes
beforeEach(async () => {
  await Person.deleteMany({})

  for (let person of helper.initialPersons) {
    let personObject = new Person(person)
    await personObject.save()
  }
})


// describe('when there is initially some persons saved', () => {

// })

// close the database once all tests have run
afterAll(async () => {
  await mongoose.connection.close()
})
