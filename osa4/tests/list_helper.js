const Blog = require('../models/blog')
//const User = require('../models/user')

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else {
    const likes = blogs.reduce((acc, blog) => {
      return acc + blog.likes
    }, 0)
    return likes
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let mostLiked = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
  return mostLiked
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  totalLikes,
  favoriteBlog,
  blogsInDb
}