import { useState } from 'react'
import Note from './components/Note'

const App = ( props ) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  )

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

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        <Note key={note.id} note={note}/>)}
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