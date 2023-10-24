const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app') // Testit käyttävät ainoastaan app.js määriteltyä express-sovellusta

const api = supertest(app)

const Blog = require('../models/blog')

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200) // odotetaan http-vastausta 200
    .expect('Content-Type', /application\/json/) // odotetaan sisällön tyypin olevan application/json, regex alkaa ja päättyy '/', joten tarvitaan toinen kenoviiva '\', jotta regex ei pääty liian aikaisin
})

test('right amount of blogs were returned', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(3) // mongodb:ssä on kolme blogia, joten odotetaan vastauksen olevan 3
})

test('blogs are identified with id field', async () => {
  const res = await api.get('/api/blogs')
  res.body.forEach(blog => { // tarkistetaan forEach-silmukan avulla, että jokainen blogi sisältää id-kentän
    expect(blog.id).toBeDefined() // toBeDefined tarkistaa, että muuttuja ei ole määrittelemätön
  });
})

test('a new blog can be added', async () => {
  const testBlog = {
    title: "Sample Blog",
    author: "admin",
    url: "https://localhost:3001/api/blogs",
    likes: 123
  }
  await api.post('/api/blogs').send(testBlog)
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(4) // Määrän pitäisi kasvaa yhdellä
  Object.values(res.body[3]).forEach(value => { // Tarkistetaan, että testiBlogin kentät eivät ole tyhjiä. Object.values palauttaa taulukon, joten tarvitaan silmukkaa
    console.log(value)
    expect(value).toBeTruthy() // ToBeTruthy tarkistaa, ettei datassa ole virheellisiä arvoja (false, 0, "", null, undefined ja NaN)
  })
})

test("if blog doesn't have title or url fields, response is status code 400 and blog is not added", async() => {
  const testBlog1 = {
    author: "testiTimo",
    likes: 20
  }

  await api
  .post('/api/blogs')
  .send(testBlog1)
  .expect(400)
})

test('if likes are not given, its value is set to 0', async () => {
  const testBlog = {
    title: "Sample Blog",
    author: "testiTimo",
    url: "http://localhost:3001/api/blogs",
    likes: ""
  }
  await api
  .post('/api/blogs')
  .send(testBlog)
  const res = await api.get('/api/blogs')
  expect(res.body[4].likes).toBe(0)
})

test('a blog can be removed, succeeds with status code 204', async() => {
  const blogs = await helper.blogsInDb()
  const blogToDelete = blogs[3]
  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)
})

test('a blog can be edited, succeeds with status code 200', async() => {
  const blogs = await helper.blogsInDb()
  const blogToEdit = blogs[blogs.length-1]
  const editedBlog = {
    title: "Sampleee",
    author: "admin",
    url: "http://localhost:3001/api/blogs",
    likes: 2345
  }
  await api
  .put(`/api/blogs/${blogToEdit.id}`)
  .send(editedBlog)
  .expect(200)
})

afterAll(async () => {
  await mongoose.connection.close() // suljetaan tietokantayhteys
})