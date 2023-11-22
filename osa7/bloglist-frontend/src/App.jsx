import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './index.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { setNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, SetPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const blogsToShow = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Hook, joka hakee kirjautuneen käyttäjän tiedot local storagesta, asettaa käyttäjän, sekä sen tokenin blogServicelle käytettäväksi, jos käyttäjä löytyi
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogsappUser') // Haetaan kirjautunut käyttäjä local storagesta
    if (loggedUser) { // Jos käyttäjä löytyy local storagesta...
      const user = JSON.parse(loggedUser) // ...tehdään JSON-muotoisesta käyttäjästä olio
      setUser(user) // Asetetaan käyttäjä
      blogService.setToken(user.token) // Asetetaan token blogServicen käyttöön
    }
  }, [])

  // blogin viitteen määritys, jotta saadaa blogForm piiloon blogin lisäyksen jälkeen
  const blogFormRef = useRef()

  // Kirjautumisen käsittelijä
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      }) // Yritetään kirjautua syötetyillä käyttäjänimellä ja salasanalla
      setUser(user) // Jos onnistui, asettaan käyttäjä
      console.log(user.token)
      blogService.setToken(user.token) // Asettetaan käyttäjän token blogServicen käyttöön
      dispatch(setNotification(`Login successful: ${username} logged in`, 'status'))
      setUsername('') // Kirjautumiseen käytettävän käyttäjänimen nollaus käyttäjän asettamisen jälkeen
      SetPassword('') // -||- salasanan -||-
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user)) // Asetetaan käyttäjän tiedot JSON-muodossa local storageen (kirjautuminen pysyy sivun päivittämisestä huolimatta)
    } catch(error) {
      dispatch(setNotification(`Login failed: ${error.response.data.error}`)) // Jos kirjautuminen ei onnistunut, annetaan virheilmoitus
    }
    console.log('logging in as', username)
    console.log(window.localStorage.getItem('loggedBlogsappUser'))
  }

  // Uloskirjautumisen käsittelijä
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(setNotification(`User ${user.username} logged out`, 'status'))
    setUser(null) // Poistetaan käyttäjän tiedot tilasta
    window.localStorage.removeItem('loggedBlogsappUser') // Poistetaan käyttäjän tiedot local storagesta
  }

  // Kirjautumisnäkymä
  const loginView = () => (
    <div>
      <h2>Log in to blogsapp</h2>
      <form onSubmit={handleLogin}>
        <div>
        username:
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password:
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => SetPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  // Bloginäkymä, uuden luonnissa on käytetty togglable-komponenttia, jotta lomake ei näy muuta kuin create a new blogia klikatessa.
  const blogsView = () => (
    <div>
      <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      {blogsToShow.map(blog =>
        <div className='blog' key={blog.id}>
          <Blog key={blog.id} blog={blog} user={user}/>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h1>Blogsapp</h1>
      <Notification />
      {!user && loginView()}
      {user && <div>
        <p className='loginMessage'>{user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogsView()}
      </div>
      }
    </div>
  )
}

export default App
