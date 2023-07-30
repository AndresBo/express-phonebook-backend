const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be longer than three characters'],
    required: [true, 'Person name is required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2} \d{4} \d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid number, enter as 04 XXXX XXXX`
    },
    minLength: [8, 'Contact number is too short'],
    required: [true, 'Please enter contact number']
  }
})

// Use the 'set' method of the schema to modify the toJSON
// method of the schema used on every instance. With the objective of changing the object
// _id into the string id. Also deletes the passwordHash and mongo versioning field __v
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
