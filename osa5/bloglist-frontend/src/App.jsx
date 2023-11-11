import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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
    }
  }, [])

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

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {title: title, author: author, url: url}
      console.log(newBlog)
      await blogService.create(newBlog)
      setStatusMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs([])
    } catch (error) {
      console.log(error.response.data.error)
      setErrorMessage(`Creating failed: ${error.response.data.error}`)
      setTimeout(() => {setErrorMessage(null)}, 4000)
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
      <form onSubmit={handleLogout}>
        {user.username} logged in
        <button type="submit">logout</button>
      </form>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input 
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input 
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      <h2>blogs</h2>    
      {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
    <h1>Blogsapp</h1>
    <Notification message={statusMessage}/>
    <Error message={errorMessage}/>
    {!user && loginView()}
    {user && blogsView()}
    </div>
  )
}

export default App