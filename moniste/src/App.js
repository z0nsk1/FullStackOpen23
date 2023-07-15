import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'

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

const App = ( props ) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
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
  // oletusarvoisesti efekti suoritetaa aina, kun komponentti renderöidään


  // input-komponentin tapahtumankäsittelijä
  // kutsutaan aina, kun syötekomponentissa tapahtuu jotain, parametrina tapahtumaolio event
  // preventDefault:a ei tarvita tässä, sillä syötekentän muutoksella ei ole oletusarvoista toimintaa
  const handleNoteChange = (event) => {
    console.log(event.target.value) // kenttä target vastaa tässä kontrolloitua input-kenttää ja value viittaa syötekentä arvoon
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault() // estää lomakkeen lähetyksen oletusarvoisen toiminnan (sivun uudelleenlatautuminen)
    console.log('button pressed', event.target) // event.target tulostaa tapahtuman kohteen, eli tässä tapauksessa form-lomakkeen
    const noteObject = { // uutta muistiinpanoa vastaava olio, sisältö komponentin tilasta newNote
      content: newNote,
      important: Math.random() > 0.5, // muistiinpano on 50% "tärkeä"
      id: notes.length + 1,
    }
    setNotes(notes.concat(noteObject)) // lisätään muistiinpano vanhojen joukkoon
    // setNotes metodi luo uuden taulukon, joka sisältää lisättävän alkion. REACTIN TILAA EI SAA MUUTTAA
    setNewNote('') // tyhjentää syötekenttää kontrolloivan tilan newNote
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
      <div>
        <button onClick={() => setShowAll(!showAll)}> 
          show { showAll ? 'important' : 'all' } 
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange} // Lomakkeen input-komponentin tapahtumankäsittelijä tilanteeseen onChange
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App