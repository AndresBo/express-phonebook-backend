const express = require('express')
const app = express()



var morgan = require('morgan')

app.use(express.json())

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
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  // get requested id parameter from URL:
  const id = Number(request.params.id)
  // find person 
  const person = persons.find(person => person.id === id)
  // validate person exists:
  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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
    return response.status(400).json({
      error: 'content missing'
    })
  }
  // check name does not exists:
  const nameCheck = persons.find(person => person.name === body.name)
  console.log(nameCheck)
  if (nameCheck) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } 

  // create new person object using request data
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  // add to persons array
  persons = persons.concat(person)
  
  response.json(person)
})


app.get('/info', (request, response) => {
  const size = persons.length
  response.send(`<p> Phonebook has info for ${size} people </p> <p> ${Date()} </p>`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT)
console.log(`server running on ${PORT}`)
