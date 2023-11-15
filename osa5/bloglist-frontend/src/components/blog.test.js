import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  title: 'Testing blog rendering',
  author: 'App Tester',
  url: 'www.example.com',
  likes: 123,
  user: '6549f057e85b14a7887bfaa6'
}

const user = {
  username: 'tester',
  name: 't. tester',
  blogs: {}
}

test('component renders only blog`s title and author when hidden', () => {
  const { container } = render(<Blog blog={blog} user={user}/>) // Renderöidään Blog-komponentin html-sisältö (React Testing Library -kirjaston funktio render) ja laitetaan se container olioon
  const element = container.querySelector('.blogTitle') // Valitaan oikea elementti containerin metodi querySelectorin avulla, jolle annetaan argumentiksi elementin css classname
  expect(element).toHaveTextContent('Testing blog rendering App Tester') // Testataan, että title ja author renderöityy
  expect(element).not.toHaveTextContent('www.example.com') // Testataan, että url...
  expect(element).not.toHaveTextContent('123') // ja likes eivät renderöidy
})

test('when view-button is pressed, url, likes and owner user is rendered', async () => {
  const { container } = render(<Blog blog={blog} user={user}/>)
  const element = container.querySelector('.blogInfo')

  const user1 = userEvent.setup() // Aloitetaan uusi userEvent sessio, jotta voidaan vuorovaikuttaa renderöityjen komponenttien kanssa tapahtumien avulla
  const button = screen.getByText('view') // Haetaan renderöidyn näkymän view-painike screenin metodilla getByText. Screenillä pääsee käsiksi renderöityyn näkymään
  await user1.click(button) // Painetaan view-painiketta

  expect(element).toHaveTextContent('www.example.com') // Testataan, että url on renderöitynyt
  expect(element).toHaveTextContent('123') // Testataan, että likes on renderöitynyt
  expect(element).toHaveTextContent('App Tester') // Testataan, että user on renderöitynyt
})

test('if like-button is pressed twice, its event handler is also called twice', async () => {
  const likeBlog = jest.fn() // Jestin avulla määritelty mock-funktio, joka annetaan tapahtumankäsittelijäksi
  // Mock-oliot ja -funktiot ovat ns. valekomponentteja, joilla korvataan testattavien komponenttien riippuvuuksia

  render(<Blog blog={blog} user={user} likeBlog={likeBlog}/>) // Renderöidään blog-komponentin html sisältö

  const user1 = userEvent.setup() // Aloitetaan userEvent sessio
  const button = screen.getByText('view') // Etsitään view-painike
  await user1.click(button) // ... ja painetaan sitä
  const like = screen.getByText('like') // Tämän jälkeen blogista laajempi info ruutu auki ja myös like-näppäin on näkyvissä, haetaan se.
  await user1.click(like) // Painetaan like-näppäintä
  await user1.click(like) // x2

  expect(likeBlog.mock.calls).toHaveLength(2) // Testaan, että likeBlog-tapahtumankäsittelijää on kutsuttu kahdesti
})

test('blog form call its callback function with correct data', async () => {
  const user1 = userEvent.setup() // Aloitetaan sessio
  const createBlog = jest.fn() // käytetään createBlog:a mock-funktiona

  render(<BlogForm createBlog={createBlog}/>) // Renderöidään uuden blogin lomake
  const formFields = screen.getAllByRole('textbox') // Haetaan kaikki lomakkeen kolme tekstikentää formFields-taulukkoon
  const submitButton = screen.getByText('create') // Haetaan uuden blogin luomisesta huolehtia create-painike

  await user1.type(formFields[0], 'Testing title field') // Kirjoitetaan 1. tekstikenttään 'Testing title field'
  await user1.type(formFields[1], 'Testing author field') // 2. tekstikenttään 'Testing author field'
  await user1.type(formFields[2], 'Testing url field') // ja kolmanteen 'Testing url field'
  await user1.click(submitButton) // ja create-painiketta klikkaamalla luodaan uusi blogi

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1) // Testataan, että createBlog on kutsuttu vain kerran
  expect(createBlog.mock.calls[0][0].title).toBe('Testing title field') // Testataan, että takaisinkutsufunktiota kutsutaan oikeilla tiedoilla
  expect(createBlog.mock.calls[0][0].author).toBe('Testing author field')
  expect(createBlog.mock.calls[0][0].url).toBe('Testing url field')
})