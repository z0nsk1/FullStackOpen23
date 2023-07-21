import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  console.log(nonExisting)
  return request.then(response => response.data.concat(nonExisting))
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

/* export default { // exportataan olio
  getAll: getAll, // vasemmalla puolella on olion kenttiä, oikealla puolella olevat nimet ovat moduulin
  create: create, // sisällä määriteltyjä muuttujia
  update: update 
}*/

// koska nimet ovat samat, tehdään asia tiiviimmin:

export default { getAll, create, update }