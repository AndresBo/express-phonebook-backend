const express = require('express')
const app = express()


const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  // id parameter in URL:
  const id = Number(request.params.id)
  //console.log(id)
  //console.log(typeof id)
  // find person 
  const person = persons.find(person => person.id === id)
  
  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.get('/info', (request, response) => {
  const size = persons.length
  response.send(`<p> Phonebook has info for ${size} people </p> <p> ${Date()} </p>`)
})


const PORT = 3000
app.listen(PORT)
console.log(`server running on ${PORT}`)
