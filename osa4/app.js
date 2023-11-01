// Varsinainen sovellus, hoitaa yhdistämisen tietokantaan, sekä ottaa käyttöön tarvittavat kirjastot/moduulit

const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // Kirjasto, jolla vältetään async/await-rakenteen vaatimaa try-catch-rakennetta virheidenkäsittelyyn
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { info, errorInfo } = require('./utils/logger')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

info('Connecting to MongoDB')

mongoose.connect(config.MONGODB_URI).then(() => {
  info('Connected to MongoDB')
}).catch((error) => {
  errorInfo('Error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app