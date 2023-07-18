const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Ariana Grande',
    number: '04 2123 4567'
  },
  {
    name: 'Homer Simpson',
    number: '04 2123 9999'
  },
]

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

// helper function that creates a new person, immediately deletes it and returns the id of deleted person
const nonExistingId = async () => {
  const person = new Person( {
    name: 'willremovesoon',
    number: '04 0000 0000'
  })
  await person.save()
  await person.deleteOne()

  return person.id.toString()
}

module.exports = {
  initialPersons,
  personsInDb,
  nonExistingId
}
