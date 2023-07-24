const mongoose = require('mongoose')

// test password restrictions with controller, not mongoose validation.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minLength: [3, 'Username is too short']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [4, 'Name is too short']
  },
  passwordHash: String,
  admin: {
    type: Boolean,
    required: true
  }
})

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//     delete returnedObject.passwordHash
//   }
// })

const User = mongoose.model('User', userSchema)

module.exports = User
