const mongoose = require('mongoose')

// if no password is given:
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
// get password from argument in command line prompt
const password = process.argv[2]
// define database URL
const url = `mongodb+srv://andresb:${password}@cluster0.1isxvxb.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
// define the schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
// define the model
const Person = mongoose.model('Person', personSchema)

// if three arguments are given, save new person to db. Else display all entries in db to terminal:
if (process.argv.length == 5) {
  
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    }
  )

  person.save().then(result => {
    console.log('person saved!', result)
    mongoose.connection.close()
    }
  )
} else {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}
