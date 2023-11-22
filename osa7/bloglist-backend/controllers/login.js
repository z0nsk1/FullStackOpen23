const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body // Kirjautuvan käyttäjän käyttäjänimi ja salasana muuttujiin
  logger.info(`Trying to login user ${username}`)

  const user = await User.findOne({ username }) // Haetaan kyseinen käyttäjä tietokannasta username:n perusteella
  const passwordMatches = user === null
    ? false
    : await bcrypt.compare(password, user.hashedPassword) // compare-metodi tarkistaa, onko password oikea (tietokantaa on tallennettu salasanasta laskettu hash, jonka takia käytetään bcrypt:ä)

  if (!(user && passwordMatches)) { // Jos käyttäjää ei ole tai salasana on väärin, vastataan 401 unauthorized ja virheviesti
    logger.errorInfo('Login failed: invalid username or password')
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userToken = { // Käyttäjä, jolle ollaan luomassa tokenia
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userToken, process.env.SECRET) // Luodaan käyttäjälle token jsonwebtoken-kirjaston metodin sign avulla

  res.status(200).send({ token, username: user.username, name: user.name, id: user.id }) // Lähetään vastaus pyynnön tekijälle
  logger.info('Login successful!')
})

module.exports = loginRouter