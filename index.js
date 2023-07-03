require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const Person = require('./models/person')

// allow express to serve static files, in this case the file located build/index.html:
app.use(express.static('build'))

// allow request from other origins by using cors:
const cors = require('cors')
app.use(cors())

var morgan = require('morgan')
const person = require('./models/person')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "0421 233 427"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "0445 233 427"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "0445 233 555"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "0455 333 567"
    }
]


const generateId = () => {
  // find the person object with largest id property in the persons array:
  const maxId = persons.length > 0 
    ? Math.max(...persons.map(person => person.id)) 
    : 0
  
  return maxId + 1
}


app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


app.delete('/api/persons/:id', (request, response) => {
  // get requested id parameter from URL:
  const id = Number(request.params.id)
  // delete person
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  // get new person from request object
  const body = request.body
  // validate request body data
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  // !!!check name does not exists: - MODIFY TO WORK WITH mongoDB
  // const nameCheck = persons.find(person => person.name === body.name)
  // console.log(nameCheck)
  // if (nameCheck) {
  //     return response.status(400).json({
  //       error: 'name must be unique'
  //     })
  //   } 

  // create new person object using Note constructor function
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // add to persons array
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


app.get('/info', (request, response) => {
  const size = persons.length
  response.send(`<p> Phonebook has info for ${size} people </p> <p> ${Date()} </p>`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handle unknown endpoints:
app.use(unknownEndpoint)


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})
