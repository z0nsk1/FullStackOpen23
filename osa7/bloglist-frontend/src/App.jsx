import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './index.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { setNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import { loginUser, logout } from './reducers/loginReducer'
import LoginForm from './components/LoginForm'

const App = () => {
  const dispatch = useDispatch()
  const blogsToShow = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  console.log(user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Hook, joka hakee kirjautuneen käyttäjän tiedot local storagesta, asettaa käyttäjän, sekä sen tokenin blogServicelle käytettäväksi, jos käyttäjä löytyi
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogsappUser') // Haetaan kirjautunut käyttäjä local storagesta
    if (loggedUser) { // Jos käyttäjä löytyy local storagesta...
      const user = JSON.parse(loggedUser) // ...tehdään JSON-muotoisesta käyttäjästä olio
      console.log(user)
      dispatch(loginUser(user))
      blogService.setToken(user.token) // Asetetaan token blogServicen käyttöön
    }
  }, [dispatch])

  // blogin viitteen määritys, jotta saadaa blogForm piiloon blogin lisäyksen jälkeen
  const blogFormRef = useRef()

  // Uloskirjautumisen käsittelijä
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
    dispatch(setNotification(`User ${user.username} logged out`, 'status'))
  }

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
      {!user && <LoginForm />}
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
