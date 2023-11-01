const logger = require('./logger')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.errorInfo(error.name, error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message } )
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}