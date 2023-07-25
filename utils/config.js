require('dotenv').config()

// A different mode is use for development and testing. The two modes
// use different databases defined as enviromental variables.
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
