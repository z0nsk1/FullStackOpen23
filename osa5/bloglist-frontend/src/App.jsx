import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='status'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
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

  // Kaikki blogit hakeva ja järjestävä hook
  useEffect(() => {
    const getBlogs = async () => {
      if (blogs.length) return // Estetään jatkuva useEffectin suorittaminen, jos blogien pituus on sama
      const response = await blogService.getAll()
      if (response.length === 0) return // Jos db on tyhjä, estetään tyhjän taulukon asettaminen hookkiin (johti ikuiseen silmukkaan get-metodissa)
      response.sort((a, b) => parseInt(b.likes) - parseInt(a.likes)) // Järjestetään tykkäyksien perusteella laskevaan järjestykseen
      setBlogs(response) // Asetetaan haetut blogit, jotta ne tulevat näkyviin
    }
    getBlogs() // Jos useEffect-hookissa käyttää async-awaitia, pitää async-functio tehdä hookin sisään ja kutsua sitä erikseen hookin sisältä
  }, [blogs]) // Päivitetään hook aina, kun blogs-taulukko muuttuu

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
      setStatusMessage(`Login successful: ${username} logged in`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setUsername('') // Kirjautumiseen käytettävän käyttäjänimen nollaus käyttäjän asettamisen jälkeen
      SetPassword('') // -||- salasanan -||-
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user)) // Asetetaan käyttäjän tiedot JSON-muodossa local storageen (kirjautuminen pysyy sivun päivittämisestä huolimatta)
    } catch(error) {
      setErrorMessage(`Login failed: ${error.response.data.error}`) // Jos kirjautuminen ei onnistunut, annetaan virheilmoitus
      setTimeout(() => {setErrorMessage(null)}, 4000)
    }
    console.log('logging in as', username)
    console.log(window.localStorage.getItem('loggedBlogsappUser'))
  }

  // Uloskirjautumisen käsittelijä
  const handleLogout = (event) => {
    event.preventDefault()
    setStatusMessage(`User ${user.username} logged out`)
    setTimeout(() => {setStatusMessage(null)}, 4000)
    setUser(null) // Poistetaan käyttäjän tiedot tilasta
    window.localStorage.removeItem('loggedBlogsappUser') // Poistetaan käyttäjän tiedot local storagesta
  }

  // Tykkäyksen käsittelijä
  const handleLike = async (likedBlog) => {
    try {
      await blogService.put(likedBlog) // Laitetaan blogServille put-pyyntö, johon annetaan parametrina tykätty blogi
      setStatusMessage(`You liked the blog "${likedBlog.title}"`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setBlogs([])
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 4000)
    }
  }

  // Poistamisen käsittelijä
  const handleRemoval = async (blogToDelete) => {
    try {
      await blogService.remove(blogToDelete) // Annetaan blogServicen removelle parametrina poistettava blogi
      setStatusMessage(`Blog "${blogToDelete.title}" was deleted successfully`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setBlogs([]) // Tyhjennetään blogitaulukko, jotta hook hakee blogit uudestaan ja poistettu blogi häviää
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {setErrorMessage(null)}, 4000)
    }
  }

  // Blogin lisäys
  const addBlog = async (newBlog) => {
    blogFormRef.current() // viitteen currentin kutsuminen kutsuu togglablen togglevisibility-funktiota, joka piilottaa lomakkeen lisäämisen jälkeen
    try {
      await blogService.create(newBlog) // Luodaan uusi blogservicen avulla
      setStatusMessage('a new blog added')
      setTimeout(() => {setStatusMessage(null)}, 4000)
      setBlogs([])
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 4000)
    }
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
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <div className='blog' key={blog.id}>
          <Blog key={blog.id} blog={blog} user={user} likeBlog={handleLike} removeBlog={handleRemoval}/>
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
