const mongoose = require('mongoose')
// user supertest package that helps write test for testing the API
const supertest = require('supertest')
const app = require('../app')

// wrap express application from app.js with supertest function to form 'superagent' object
const api = supertest(app)

const helper = require('./test_helper')
const Person = require('../models/person')

// clear and initialize the database by saving two notes before every test
beforeEach(async () => {
  await Person.deleteMany({})

  for (let person of helper.initialPersons) {
    let personObject = new Person(person)
    await personObject.save()
  }
})


describe('when there is initially some persons saved', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all persons are returned', async () => {
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(helper.initialPersons.length)
  })

  test('a specific person is in returned persons', async () => {
    const response = await api.get('/api/persons')

    const names = response.body.map(person => person.name)

    expect(names).toContain('Homer Simpson')
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const personsAtStart = await helper.personsInDb()
    console.log('typeof personsAtStart', typeof personsAtStart)
    const personToView = personsAtStart[0]

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log('typeof result person', typeof resultPerson)
    expect(resultPerson.body).toEqual(personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    console.log('non existing id', validNonExistingId)

    await api
      .get(`/api/persons/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '45678ddd'

    await api
      .get(`/api/persons/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new person', () => {
  test('succeeds with valid data', async () => {
    const newPerson = {
      name: 'Van Helsing',
      number: '04 0101 0101'
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd).toHaveLength(helper.initialPersons.length + 1)

    const names = personsAtEnd.map(person => person.name)
    expect(names).toContain('Van Helsing')
  })
})

// close the database once all tests have run
afterAll(async () => {
  await mongoose.connection.close()
})
