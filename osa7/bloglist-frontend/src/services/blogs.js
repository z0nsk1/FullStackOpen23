import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

// tokenin asetus, jotta saadaan tokenia vaativat operaatiot toimimaan
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Haetaan kaikki blogit
const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log(response.data)
  return response.data
}

// Uuden blogin luonti, post-pyynnön mukana tulee lähettää token, koska backend estää blogin lisäämisen ilman tokenia
// Paratmetrina tulee uusi blogi, joka lähetetään pyynnön mukana
const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

// Tykkäyksien päivitys, lähetetään put-pyyntö, jossa on blogin entiset tiedot, sekä likes on lisätty 1
// Myös put-pyynnön mukana tarvitaa token
const put = async blog => {
  const likedBlog = { ...blog, likes: blog.likes + 1 }
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, likedBlog, config)
  return response.data
}

// Blogin poisto, parametrina tulee poistettava blogi ja delete-pyyntö lähetetään tämän id:n perusteella
// Myös poistaminen tarvitsee tokenin
const remove = async blog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, setToken, create, put, remove }