//require('dotenv').config()

//const express = require('express')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

//app.use(express.json())

//const Person = require('./models/person')

// allow express to serve static files, in this case the file located build/index.html:
//app.use(express.static('build'))

// allow request from other origins by using cors:
// const cors = require('cors')
// app.use(cors())

//var morgan = require('morgan')
//const person = require('./models/person')
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "0421 233 427"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "0445 233 427"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "0445 233 555"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "0455 333 567"
//     }
// ]


// const generateId = () => {
//   // find the person object with largest id property in the persons array:
//   const maxId = persons.length > 0 
//     ? Math.max(...persons.map(person => person.id)) 
//     : 0
  
//   return maxId + 1
// }


// app.get('/api/persons', (request, response) => {
//   Person.find({}).then(person => {
//     response.json(person)
//   })
// })


// app.get('/api/persons/:id', (request, response, next) => {
//   Person.findById(request.params.id)
//     .then(person => {
//       if (person) {
//         response.json(person)
//       } else {
//         response.status(404).end()
//       }
//     })// next function needs a parameter(error) to continue to errorHandler middleware:
//     .catch(error => next(error))
// })


// app.delete('/api/persons/:id', (request, response, next) => {
//   Person.findByIdAndRemove(request.params.id)
//     .then(result => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })


// app.post('/api/persons', (request, response, next) => {
//   // get new person from request object
//   const body = request.body
//   // create new person object using Note constructor function
//   const person = new Person({
//     name: body.name,
//     number: body.number,
//   })
//   // add to persons array
//   person.save()
//     .then(savedPerson => {
//       response.json(savedPerson)
//     })
//     .catch(error => next(error))
// })


// app.put('/api/persons/:id', (request, response, next) => {
//   const { name, number } = request.body

//   Person.findByIdAndUpdate(
//     request.params.id,
//     { name, number },
//     { new: true, runValidators: true, context: 'query' }
//   )
//     .then(updatedPerson => {
//       response.json(updatedPerson)
//     })
//     .catch(error => next(error))
// })


// app.get('/info', (request, response, next) => {
//   Person.count()
//     .then(count => {
//       response.json(
//         { NumberOfPersons:count,
//           date:Date()
//         }
//       )
//     })
//     .catch((error) => next(error) )
// })




// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }
// // handle unknown endpoints:
// app.use(unknownEndpoint)


// error handling middleware
// const errorHandler = (error, request, response, next) => {
//   console.log(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }

// app.use(errorHandler)


//const PORT = process.env.PORT
app.listen(config.PORT, () => {
  logger.info(`server running on ${config.PORT}`)
})
