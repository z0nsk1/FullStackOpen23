// Tämä moduuli hoitaa Routejen tapahtumankäsittelijät eli kontrollerit

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { info, errorInfo } = require('../utils/logger')

// Olemassa olevien blogien hakeminen
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

// Uuden blogin lisäys
blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  info(request.body)

  info(body.likes)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === "" ? 0 : body.likes,
  })

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    }).catch(error => {
        next(error)
    })
})

module.exports = blogsRouter