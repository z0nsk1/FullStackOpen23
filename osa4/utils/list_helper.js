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

module.exports = {
  totalLikes,
  favoriteBlog
}