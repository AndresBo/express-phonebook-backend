const mongoose = require('mongoose')
// use supertest package that helps write test for testing the API
const supertest = require('supertest')
const app = require('../app')

// wrap express application from app.js with supertest function to form 'superagent' object
const api = supertest(app)

const helper = require('./test_helper')
const Person = require('../models/person')
const User = require('../models/user')

// clear and initialize the database by saving two users and two persons before every test
beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

  }

  await Person.deleteMany({})

  for (let person of helper.initialPersons) {
    let personObject = new Person(person)
    await personObject.save()
  }
}, 15000)


describe('when there is initially some persons saved', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

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

    const personToView = personsAtStart[0]

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultPerson.body).toEqual(personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()


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
  test('succeeds when an authorized user, uses valid data', async () => {
    const validUser = {
      username: 'mario',
      password: 'password'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(validUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(loggedUser)
    const newPerson = {
      name: 'Van Helsing',
      number: '04 0101 0101'
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd).toHaveLength(helper.initialPersons.length + 1)

    const names = personsAtEnd.map(person => person.name)
    expect(names).toContain('Van Helsing')
  })

  test('fails with status code 401 if data is invalid', async () => {
    // new person missing name property
    const newPerson = {
      number: '04 2123 2345'
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(401)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length)
  })
})

describe('deletion of a person', () => {
  test('succeeds with status code 204 when id is valid and user is authorized', async () => {
    const validUser = {
      username: 'mario',
      password: 'password'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(validUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtStart = await helper.personsInDb()

    const personToDelete = personsAtStart[0]

    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .expect(204)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length - 1)

    expect(personsAtEnd).not.toContain(personToDelete)
  })

  test('fails with status code 401 when id is valid but user is unauthorized', async () => {
    const unauthorizedUser = {
      username: 'luigi',
      password: 'password'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(unauthorizedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtStart = await helper.personsInDb()

    const personToDelete = personsAtStart[0]

    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .expect(401)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length)

    //expect(personsAtEnd).not.toContain(personToDelete)
  })
})

describe('modifying a person details', () => {
  test('succeds when id is valid and user is authorized', async () => {
    const validUser = {
      username: 'mario',
      password: 'password'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(validUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtStart = await helper.personsInDb()

    const personToModify = personsAtStart[1]

    const modifiedPerson = {
      name: 'Homer Simpson',
      number: '04 0000 0000'
    }

    await api
      .put(`/api/persons/${personToModify.id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(modifiedPerson)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd[1].number).toBe(modifiedPerson.number)
  })

  test('fails when id is valid but user is not authorized', async () => {
    const invalidUser = {
      username: 'luigi',
      password: 'password'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const personsAtStart = await helper.personsInDb()

    const personToModify = personsAtStart[1]

    const modifiedPerson = {
      name: 'Homer Simpson',
      number: '04 0000 0000'
    }

    await api
      .put(`/api/persons/${personToModify.id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(modifiedPerson)
      .expect(401)

    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd[1].number).toBe(personsAtStart[1].number)
  })
})

// close the database once all tests have run
afterAll(async () => {
  await mongoose.connection.close()
})
