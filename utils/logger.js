
// function that prints normal log messages:
const info = (...params) => {
  console.log(...params)
}
// function that prints error messages:
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
