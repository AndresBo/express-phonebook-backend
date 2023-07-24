const personsRouter = require('express').Router()
const Person = require('../models/person')


personsRouter.get('/info', (request, response, next) => {
  Person.count()
    .then(count => {
      response.json(
        { NumberOfPersons:count,
          date:Date()
        }
      )
    })
    .catch((error) => next(error) )
})

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })// next function needs a parameter(error) to continue to errorHandler middleware:
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  // get new person from request object
  const body = request.body
  // create new person object using Note constructor function
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // add to persons array
  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


module.exports = personsRouter
