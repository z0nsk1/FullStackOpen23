import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogInfo from './components/BlogInfo'

const Notification = ( {message} ) => {
  if (message === null) {
    return null
  }
  return (
    <div className='status'>
      {message}
    </div>
  )
}

const Error = ( {message} ) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, SetPassword] = useState('')
  const [user, setUser] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
 
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [blogs])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      console.log(user.token)
      blogService.setToken(user.token)
      setStatusMessage(`Login successful: ${username} logged in`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setUsername('')
      SetPassword('')
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user))
    } catch(error) {
        setErrorMessage(`Login failed: ${error.response.data.error}`)
        setTimeout(() => {setErrorMessage(null)}, 4000)
    }
    console.log('logging in as', username)
    console.log(window.localStorage.getItem('loggedBlogsappUser'))
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setStatusMessage(`User ${user.username} logged out`)
    setTimeout(() => {setStatusMessage(null)}, 4000)
    setUser(null)
    window.localStorage.removeItem('loggedBlogsappUser')
  }

  const addBlog = async (newBlog) => {
    blogFormRef.current()
    try {
      await blogService.create(newBlog)
      setStatusMessage(`a new blog added`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setBlogs([])
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 4000)
    }
  }

  const loginView = () => (
    <div>
    <h2>Log in to blogsapp</h2>
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => SetPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>
  )

  const blogsView = () => (
    <div>
      <Togglable buttonLabel="Create a new blog" cancelLabel="cancel" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>  
      {blogs.map(blog =>
      <div className='blog' key={blog.id}>
        <Blog key={blog.id} blog={blog} />
      </div>
      )}
    </div>
  )

  return (
    <div>
    <h1>Blogsapp</h1>
    <Notification message={statusMessage}/>
    <Error message={errorMessage}/>
    {!user && loginView()}
    {user && <div>
      <p className='loginMessage'>{user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogsView()}
    </div>
    }
    </div>
  )
}

export default App