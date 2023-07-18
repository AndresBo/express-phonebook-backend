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

module.exports = {
  initialPersons,
  personsInDb
}
