const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.errorInfo(error.name, error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message } )
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or it is invalid' })
  }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization') // Haetaan pyynnön authorization-kenttä
  if (authorization && authorization.startsWith('Bearer ')) { // Jos se on olemassa ja alkaa 'Bearer'...
    req.token = authorization.replace('Bearer ', '') // ...poistetaan 'bearer' alku (jotta saadaan pelkkä token) ja sijoitetaan se pyynnön token-kenttään
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization') // Haetaan pyynnön authorization-kenttä
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '') // Erotetaan token authorization-kentästä
    const dToken = jwt.verify(token, process.env.SECRET) // Dekoodataan token
    const user = await User.findById(dToken.id) // Etsitään käyttäjä jolle token kuuluu
    req.user = user // Laitetaan käyttäjä pyynnön user-kenttään
  } else if (req.method !== 'GET') {
    res.status(401)
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}