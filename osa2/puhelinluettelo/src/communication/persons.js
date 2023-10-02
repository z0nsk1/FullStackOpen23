import axios from 'axios'
const baseUrl = '/api/persons'

// Haetaan kaikki tiedot palvelimelta
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// Luodaan uusi tieto (note) ja viedään se palvelimelle
const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

// Datan poisto palvelimelta
const remove = (id) => {
    console.log(`Deleting ${baseUrl}/${id}`)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

// Vanha tiedon korvaaminen uudella palvelimessa
const updateNumber = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson)
    return request.then(response => response.data)
}

export default { getAll, create, remove, updateNumber }