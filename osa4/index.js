const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

app.use(cors())
app.use(express.json())

const mongoUrl = process.env.MONGODB_URI
console.log('Connecting to MongoDB')
mongoose.connect(mongoUrl).then(result => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Error connecting to MongoDB: ', error.message)
})

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body
  console.log(request.body)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})