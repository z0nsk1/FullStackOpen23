// Tämä moduuli hoitaa Routejen tapahtumankäsittelijät eli kontrollerit

const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')

// Olemassa olevien blogien hakeminen
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  res.json(blogs)
})

// Uuden blogin lisäys
blogsRouter.post('/', async (req, res) => {
  if (req.headers.authorization === undefined) {
    return res.status(401)
  }
  const { title, author, url, likes } = req.body
  logger.info(req.body)

  /*const decodedToken = jwt.verify(req.token, process.env.SECRET)
  logger.info('Decoded token: ', decodedToken)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
*/
  const user = req.user
  logger.info(user.blogs)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes === '' ? 0 : likes,
    user: user.id
  })

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  res.status(201).json(addedBlog)
})

// Blogin poisto, poisto onnistuu vain jos poistajalla on sama token kuin lisääjällä
blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id) // Etsitään DELETE-pyynnön mukana tullutta id:tä vastaava blogi
  if (blog === null) { // Jos blogia ei löydy, vastataan koodilla 404 not found
    return res.status(404).json({ error: `blog with id ${req.params.id} doesn't exist` })
  }
  if (blog.user.toString() === req.user.id) { // Jos blogiin liitetyn käyttäjän id on sama kuin poiston tehneen käyttäjän id (joka selvitettiin tokenilla), poistetaan blogi
    await Blog.findByIdAndRemove(req.params.id)
    logger.info(`deleted blog with id ${req.params.id}`)
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'not allowed' }) // Muussa tapauksessa estetään poisto ja ilmoitetaan, että toiminto ei ole sallittu
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const addedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.status(204).json(addedBlog)
})

module.exports = blogsRouter