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
  res.body.forEach(blog => { // Tarkistetaan forEach-silmukan avulla, että jokainen blogi sisältää id-kentän
    expect(blog.id).toBeDefined() // toBeDefined tarkistaa, että muuttuja ei ole määrittelemätön
  });
})

afterAll(async () => {
  await mongoose.connection.close() // suljetaan tietokantayhteys
})