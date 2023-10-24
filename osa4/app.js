// Varsinainen sovellus, hoitaa yhdistämisen tietokantaan, sekä ottaa käyttöön tarvittavat kirjastot/moduulit

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const { info, errorInfo } = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

info('Connecting to MongoDB')

mongoose.connect(config.MONGODB_URI).then(result => {
  info('Connected to MongoDB')
}).catch(error => {
  errorInfo('Error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app