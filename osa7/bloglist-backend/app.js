// Varsinainen sovellus, hoitaa yhdistämisen tietokantaan, sekä ottaa käyttöön tarvittavat kirjastot/moduulit

const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // Kirjasto, jolla vältetään async/await-rakenteen vaatimaa try-catch-rakennetta virheidenkäsittelyyn
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
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
app.use('/api/blogs', middleware.tokenExtractor, middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/emptydb_router')
  app.use('/api/testing', testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app