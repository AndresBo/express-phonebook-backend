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

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
