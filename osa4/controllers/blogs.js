// Tämä moduuli hoitaa Routejen tapahtumankäsittelijät eli kontrollerit

const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

// Olemassa olevien blogien hakeminen
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  res.json(blogs)
})

// Uuden blogin lisäys
blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body
  logger.info(req.body)

  const user = await User.findById('65412eaff095dfb04a091a64')
  if (user === null) {
    return res.status(404).json('User not found')
  }
  logger.info('Found user: ', user)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id
  })

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  res.status(201).json(addedBlog)
})

module.exports = blogsRouter