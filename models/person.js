const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

// const password = process.argv[2]
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

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
        return /\d{2} \d{4} \d{4}/.test(v);
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
