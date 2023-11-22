const Blog = require('../models/blog')
//const User = require('../models/user')
const Lodash = require('lodash')

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

const mostBlogs = (blogs) => {
  const blogsPerBlogger = Lodash.countBy(blogs.map(blog => blog.author)) // Mapataan ensin blogien omistajat taulukkoon, josta lodash.countby:n avulla selvitetään, kuinka monta kertaa henkilö esiintyy taulukossa
  const max = Math.max(...Object.values(blogsPerBlogger)) // Etsitään suurin arvo äsken luodusta taulukosta
  for (let blogger in blogsPerBlogger) { // Käydään taulukko läpi silmukalla
    if (blogsPerBlogger[blogger] === max) { // Kun taulukosta löydetään suurimman arvon omaava alkio...
      return { "author": blogger, "blogs": max }  // palautetaan se halutussa muodossa, eli author ja blogien määrä
    }
  }
}

const mostLikes = (blogs) => {
  let likesPerBlogger = blogs.reduce((newObject, blog) => { // Käydään taulukko läpi reducella, newObject tulee olemaan uusi olio, johon arvoja laitetaan ja blog nykyisessä indeksissä oleva olio blogs-taulukossa
    if (!Object.prototype.hasOwnProperty.call(newObject, blog.author)) { // Jos uudessa oliossa newObject ei vielä ole nykyisessä blog-oliossa olevaa authoria, alustetaan se arvolla nolla
      newObject[blog.author] = 0
    }
    newObject[blog.author] += blog.likes // lisätään newObject-olioon nykyisen blog-olion authorille nykyisen blog-olion liket
    return newObject // lopuksi palautetaan uusi olio
  }, {}) // tyhjä olio on newObject:n alkuarvo, joka tarvitaan newObject:n alustukseen
  const max = Math.max(...Object.values(likesPerBlogger)) // Haetaan luodusta oliosta suurin likejen arvo
  for (let blogger in likesPerBlogger) { // Käydään taulukko läpi silmukalla
    if (likesPerBlogger[blogger] === max) { // Kun taulukosta löydetään alkio, jolla on suurin like-määrä
      return { "author": blogger, "likes": max } // Palautetaan kyseinen alkio halutussa muodossa
    }
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  blogsInDb,
  mostBlogs,
  mostLikes
}