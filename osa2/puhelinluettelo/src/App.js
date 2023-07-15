import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filter, handleFilter}) => (
  <form>
  <div> filter shown with: <input value={filter} onChange={handleFilter}/></div>
  </form>
)

//  Komponentti, joka filtteröi näytettävät henkilöt
const Persons = ({persons, filter}) => {
  const personsToShow = persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase()))
  return (
    <div>
     {personsToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
)}

// Henkilön verkkosivulle lisäävä komponentti
const AddPerson = ({addPerson, newName, newNumber, handleNewName, handleNewNumber}) => (
  <form onSubmit={addPerson}>
  <div> name: <input value={newName} onChange={handleNewName}/></div>
  <div> number: <input value={newNumber} onChange={handleNewNumber}/></div>
  <div><button type="submit">add</button></div>
</form>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Lisää uusi yhteystieto')
  const [newNumber, setNewNumber] = useState('Lisää numero')
  const [filter, setFilter] = useState('')

  // Efekti
  const hook = () => {
    console.log('Effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise fulfilled')
        setPersons(response.data)
      })
  }
  
  console.log('Rendering', persons.length, 'persons')
  useEffect(hook, [])

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
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new contact</h2>
      <AddPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )

}

export default App