const jwt = require('jsonwebtoken')
const personsRouter = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')

// gets the number of persons and current date
personsRouter.get('/info', async (request, response, next) => {
  try {
    const count = await Person.count()

    response.json({ NumberOfPersons:count, date:Date() })
  } catch(error) {
    next(error)
  }

})

// GETs all persons
personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

// GETs a specific person
personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch(error) {
    // next function needs a parameter(error) to continue to errorHandler middleware:
    next(error)
  }
})

// DELETES a person
personsRouter.delete('/:id', async (request, response, next) => {
  try {
    // check and decode user token - it returns Object on which token was based on.
    // note that token is place in request.token by middleware tokenExtractor
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    // find user trying to delete document
    const user = await User.findById(decodedToken.id)
    // check if user is admin
    if (!user.admin) {
      return response.status(401).json({ error: 'user unauthorized to delete' })
    }

    const person = await Person.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch(error) {
    next(error)
  }
})

// POST a new person
personsRouter.post('/', async (request, response, next) => {
  try {
    // get new person from request object
    const body = request.body

    // check and decode user token - it returns Object on which token was based on.
    // note that token is place in request.token by middleware tokenExtractor
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    // find user trying to post document
    const user = await User.findById(decodedToken.id)
    // check if user is admin
    if (!user.admin) {
      return response.status(401).json({ error: 'unauthorized to post new persons' })
    }

    // create new person object using Note constructor function
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    // add to persons array
    const savedPerson = await person.save()

    response.status(201).json(savedPerson)
  } catch(error) {
    next(error)
  }
})

// PUT a person
personsRouter.put('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user.admin) {
      return response.status(401).json({ error: 'unauthorized to make changes' })
    }

    const { name, number } = request.body
    // note findByIdAndUpdate receives a JS object, not a new person object created with Person contructor.
    // {new: true} is necessary to return updated document instead of the original.
    const updatedPerson = await Person.findByIdAndUpdate(request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )

    response.json(updatedPerson)
  } catch(error) {
    next(error)
  }
})


module.exports = personsRouter
