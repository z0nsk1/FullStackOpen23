import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('Lisää uusi yhteystieto')
  const [newNumber, setNewNumber] = useState('Lisää numero')
  const [filter, setFilter] = useState('')

const addPerson = (event) => {
  event.preventDefault() // estetään lomakkeen lähetys
  console.log('Adding a new person...')
  const newPerson = { //Henkilö-olio
    name: newName,
    number: newNumber,
    id: persons.length +1,
  }
  // Tutkitaan, onko henkilö jo lisätty ja annetaan varoitus, sekä poistutaan ennen henkilön lisäystä
  if (persons.find(person => person.name === newPerson.name)) {
    return (
      alert(`${newName} is already added to phonebook`)
    )
  }
  setPersons(persons.concat(newPerson))
  console.log('New person added:', newPerson.name)
  setNewName('')
  setNewNumber('')
}


// Nimikentän tapahtumankäsittelijä
const handleNewName = (event) => {
  console.log(event.target.value)
  setNewName(event.target.value)
}

// Puhelinkentän tapahtumankäsittelijä
const handleNewNumber = (event) => {
  console.log(event.target.value)
  setNewNumber(event.target.value)
}

const handleFilter = (event) => {
  console.log(event.target.value)
  setFilter(event.target.value)
}

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div> filter shown with: <input value={filter} onChange={handleFilter}/></div>
      </form>
      <form onSubmit={addPerson}>
        <div> name: <input value={newName} onChange={handleNewName}/></div>
        <div> number: <input value={newNumber} onChange={handleNewNumber}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
      </div>
    </div>
  )

}

export default App