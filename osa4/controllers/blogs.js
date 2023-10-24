// Tämä moduuli hoitaa Routejen tapahtumankäsittelijät eli kontrollerit

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

// Olemassa olevien blogien hakeminen
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

// Uuden blogin lisäys
blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  logger.info(request.body)
  logger.info(body.likes)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === "" ? 0 : body.likes, // Jos likes-kentän arvo on "", laitetaan arvoksi 0, muuten likes-kentälle asetettu arvo
  })

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    }).catch(error => {
        next(error)
    })
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter