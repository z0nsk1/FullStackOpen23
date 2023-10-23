const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Testit käyttävät ainoastaan app.js määriteltyä express-sovellusta

const api = supertest(app)

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

const testBlog = {
  title: "Sample Blog",
  author: "testiTimo",
  url: "http://localhost:3001/api/blogs",
  likes: 10
}

test('a new blog can be added', async () => {
  await api.post('/api/blogs').send(testBlog)
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(4) // Määrän pitäisi kasvaa yhdellä
  Object.values(res.body[3]).forEach(value => { // Tarkistetaan, että testiBlogin kentät eivät ole tyhjiä. Object.values palauttaa taulukon, joten tarvitaan silmukkaa
    console.log(value)
    expect(value).toBeTruthy() // ToBeTruthy tarkistaa, ettei datassa ole virheellisiä arvoja (false, 0, "", null, undefined ja NaN)
  })
})

afterAll(async () => {
  await mongoose.connection.close() // suljetaan tietokantayhteys
})