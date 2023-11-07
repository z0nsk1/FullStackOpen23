const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Adding a new user', () => {
  const newUser = {
    username: 'test',
    name: 'test',
    password: 'test'
  }
  test('with valid information succeeds', async () => {
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
  test('with too short username', async () => {
    const newUser = {
      username: 'te',
      name: 'This Is a Test',
      password: 'test123'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('without username fails', async () => {
    const newUser = {
      username: '',
      name: 'This Is a Test',
      password: 'test123'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('with too short password fails', async () => {
    const newUser = {
      username: 'testitesti',
      name: 'This Is a Test',
      password: 't'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('password is too short')
  })
  test('with missing password fails', async () => {
    const newUser = {
      username: 'testitesti',
      name: 'This Is a Test',
      password: ''
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('password is missing or contains white spaces')
  })
  test('with password containing white spaces fails', async () => {
    const newUser = {
      username: 'testitesti',
      name: 'This Is a Test',
      password: '  sdf '
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('password is missing or contains white spaces')
  })
  test('that is not unique fails (username already used)', async () => {
    const newUser = {
      username: 'testitesti',
      name: 'HeiMoi',
      password: 'tasd'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('expected `username` to be unique')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})