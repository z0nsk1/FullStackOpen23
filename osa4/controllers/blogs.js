// Tämä moduuli hoitaa Routejen tapahtumankäsittelijät eli kontrollerit

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

// Olemassa olevien blogien hakeminen
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

// Uuden blogin lisäys
blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body
  logger.info(req.body)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  const addedBlog = await blog.save()
  res.status(201).json(addedBlog)
})

module.exports = blogsRouter