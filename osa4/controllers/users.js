const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async(req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Uuden käyttäjän lisääminen
usersRouter.post('/', async (req, res) => {
  const { username, name, password }  = req.body
  if (password === '' || password.includes(' ')) {
    return res.status(400).json({ error: `password is missing or contains white spaces` })
  } else if (password.length < 3){
    return res.status(400).json({ error: `password is too short` })
  }
  logger.info(`Adding user: username: ${username}, name: ${name}`)

  // Salasanan tunnisteen luonti
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Asetetaan uuden käyttäjän tiedot
  const user = new User({
    username,
    name,
    hashedPassword,
  })

  // Ja tallennetaan uusi käyttäjä
  const addedUser = await user.save()
  res.status(201).json(addedUser)
  logger.info('User added!')
})

module.exports = usersRouter