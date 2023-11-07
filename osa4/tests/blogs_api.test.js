const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Testit käyttävät ainoastaan app.js määriteltyä express-sovellusta
const api = supertest(app)
const helpFunctions = require('./list_helper')

/*let token = ""

beforeAll(async () => {
  const res = await api.post('api/login').send({ username: "test", password: "test" })
  token = res.body.token
})*/

describe('getting the blogs', () => {
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
})

describe('addition of a blog', () => {
  test('total amount of blogs rises by 1 and content type is correct', async () => {
    const blogsBefore = await helpFunctions.blogsInDb()
    const testUser = {
      username: "test",
      password: "test"
    }
    const result = await api.post('/api/login').send(testUser)
    const token = result.body.token
    console.log(result.body.id)

    const testBlog = {
      title: 'Testing Testing',
      author: 'Tester',
      url: 'www.example.com',
      likes: 6,
      userId: result.body.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const allBlogs = await helpFunctions.blogsInDb()
    expect(allBlogs).toHaveLength(blogsBefore.length + 1)
  })
  test('without likes-field given, it will be set to 0', async () => {
    const result = await api.post('/api/login').send({ username: "test", password: "test" })
    const token = result.body.token

    const testBlog = {
      title: 'Testing Testing',
      author: 'Tester',
      url: 'www.example.com',
      likes: '',
      userId: result.body.id
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(testBlog)
      .expect(201)
    expect(res.body.likes).toBe(0)
  })
  test('without title or url fields fails with status code 400', async () => {
    const result = await api.post('/api/login').send({ username: "test", password: "test" })
    const token = result.body.token
    const testBlog = {
      title: '',
      author: 'Tester',
      url: 'www.example.com',
      likes: 1,
    }
    const testBlog1 = {
      title: 'Test',
      author: 'Tester',
      url: '',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(testBlog)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(testBlog1)
      .expect(400)
  })
  test('without token fails with statuscode 401', async () => {
    const blogsBefore = await helpFunctions.blogsInDb()

    const testBlog = {
      title: 'Testing Testing',
      author: 'Tester',
      url: 'www.example.com',
      likes: 50
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401)
    const allBlogs = await helpFunctions.blogsInDb()
    expect(allBlogs.length).toHaveLength(blogsBefore.length)
  })
})

describe('deletion of a blog', () => {
  test('with valid id succeeds with status code 204 and amount of blogs in db decreases by one', async () => {
    const blogs = await helpFunctions.blogsInDb()
    const blogToDelete = blogs[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const remainingNotes = await helpFunctions.blogsInDb()
    expect(remainingNotes).toHaveLength(3)
  })
})

describe('updating a blog', () => {
  test('with valid data succeeds with status code 204 and data has changed', async () => {
    const testBlog = {
      title: 'Testing Testing',
      author: 'Tester',
      url: 'www.example.com',
      likes: 10,
    }
    const blogs = await helpFunctions.blogsInDb()
    const blogToUpdate = blogs[0]

    const res = await api.put(`/api/blogs/${blogToUpdate.id}`).send(testBlog).expect(204)
    expect(res.body).toContain(testBlog.title, testBlog.author, testBlog.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close() // suljetaan tietokantayhteys
})