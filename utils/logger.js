
// function that prints normal log messages (except for when testing)
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}
// function that prints error messages (except for when testing)
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}
