const express = require('express') // ottaa käyttöön noden sisäänrakennetun web-palvelimen määrittelevän moduulin
// vrt import http from 'http'
const app = express()

app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (req, res) => {
    res.json(notes)
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => { 
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    // Jos muistiinpanoa ei löydy, palautetaan error 404, eli "not found"
    if (note) {
        response.json(note)
    } else {
        response.status(404).end() // end ilmoittaa siitä, että pyyntöön tulee vastata ilman dataa
    }
    
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id)) // notes.map muodostaa taulukon muistiinpanojen id-kentistä. Math.max palauttaa maksimin sille annetuista arvoista. Math.max:lle ei kelpaa taulukko, joten se muutetaan yksittäisiksi luvuiksi taulukon spread-syntaksilla, eli ...taulukko
        : 0
    return maxId + 1
  }

  app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)
    response.json(note)
  })

// sidotaan muuttujaan app sijoitettu http-palvelin kuuntelemaan porttiin 3001 tulevia http-pyyntöjä
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)