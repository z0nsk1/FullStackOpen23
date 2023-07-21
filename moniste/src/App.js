import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes' // siirrettiin url käsittelyt omalle moduulille
import './index.css'

/*const promise = axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data // promisen data-kentästä löytyy halutut muistiinpanot
    console.log('Notes from url:', notes)
  })
console.log(promise)*/

// promise.then(response => console.log(response)) 
// tapahtumankuuntelija promisea vastaavan operaation tulokselle, liitetty nyt suoraan axioksen get-metodiin

//const promise2 = axios.get('http://localhost:3001/foobar')
//console.log(promise2)

const Notification = ({ message }) => {
  if (message === null) { // Jos propsin arvo on null, ei renderöidä mitään.
    return null
  }

  return ( // muussa tapauksessa viesti div-elementtiin
    <div className="error">
      {message} 
    </div>
  )
}

const Footer = () => {
  const footerStyle = {  // Inline-css, jokainen css-sääntö on olion kenttä, joten js-syntaksin 
    color: 'green',      // mukaan kentät erotetaan pilkulla. Kokonaisluku fonttikoossa tarkoittaa
    fontStyle: 'italic', // pikseleitä. Arvot pitää olla hipsuissa
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

    /*const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
    })
  }

  console.log('render', notes.length, 'notes')
  useEffect(hook, []) //funktiolle useEffect annetaan kaksi parametria, ensimmäinen on funktio eli efekti
  // ja toinen parametri tarkentaa, miten usein efekti suoritetaan. Kun toisena parametrina on tyhjä
  // taulukko, efekti suoritetaa ainoastaan komponentin ensimmäisen renderöinnin jälkeen
  // oletusarvoisesti efekti suoritetaa aina, kun komponentti renderöidään*/

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault() // estää lomakkeen lähetyksen oletusarvoisen toiminnan (sivun uudelleenlatautuminen)
    console.log('button pressed', event.target) // event.target tulostaa tapahtuman kohteen, eli tässä tapauksessa form-lomakkeen
    const noteObject = { // uutta muistiinpanoa vastaava olio, sisältö komponentin tilasta newNote
      content: newNote,
      important: Math.random() > 0.5, // muistiinpano on 50% "tärkeä"
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })

    /*
    axios                                            // lähetetään uusi muistiinpano palvelimelle axioksen post-metodilla
    .post('http://localhost:3001/notes', noteObject) // lähetetty data on JavaScript-olio, joten axios osaa automaattisesti 
    .then(response => {                              // asettaa pyynnön Content-type headerille oikean arvon eli application/json 
      setNotes(notes.concat(response.data))          // lisätään vielä uusi muistiinpano näkyviin, muista: concat ei muuta komponentin
      setNewNote('')                                 // alkuperäistä tilaa, vaan luo uuden taulukon. setNewNote:lla tyhjennetään vielä
      console.log(response)                          // lomakkeen teksti        
    })*/
  }

  const toggleImportanceOf = (id) => {
    // const url = `http://localhost:3001/notes/${id}` // jokaisen muistiinpanon yksilöivä url
    const note = notes.find(n => n.id === id)       // find etsii muutettavan muistiinpanon ja talletetaan sen viite note:en
    const changedNote = {...note, important: !note.important } // luodaan uusi olio, jonka sisältö on sama kuin vanhassa oliossa,
                                                               // pois lukien kenttä important, josta tulee päinvastainen
                                                               // huom. ...note on object spread -syntaksia, joka kopioi olion
    noteService // siirrettiin url käsittelyt omalle moduulille
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server` 
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })

    /*axios.put(url, changedNote).then(response => { // put-pyyntö korvaa aiemman muistiinpanon
      setNotes(notes.map(note => note.id !== id ? note : response.data)) // takaisinkutsufunktiossa asetetaan komponentin App tilaan
      // notes kaikki vanhat muistiinpanot, paitsi muuttunut, josta tilaan asetetaan palvelimen palauttama versio 
    })*/


    /* console.log(`importance of ${id} need to be toggled`) // ${id} vastaa samaa kuin '...' + id + '...', huom. eri hipsumerkki*/
  }                                                       // ES6 template string -ominaisuuden ansiosta on mahdollisuus kirjottaa 
                                                          // asia siistimmin 

  // input-komponentin tapahtumankäsittelijä
  // kutsutaan aina, kun syötekomponentissa tapahtuu jotain, parametrina tapahtumaolio event
  // preventDefault:a ei tarvita tässä, sillä syötekentän muutoksella ei ole oletusarvoista toimintaa
  const handleNoteChange = (event) => {
    console.log(event.target.value) // kenttä target vastaa tässä kontrolloitua input-kenttää ja value viittaa syötekentä arvoon
    setNewNote(event.target.value)
  }

  //määrittely ehdollisella operaattorilla
  // const tulos = ehto ? val1 : val2
  // muuttujan tulos arvoksi asetetaan val1:n arvo jos ehto on tosi, jos ehto on epätosi, arvoksi tulee val2
  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}> 
          show { showAll ? 'important' : 'all' } 
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map(note =>
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange} // Lomakkeen input-komponentin tapahtumankäsittelijä tilanteeseen onChange
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App