import { useState, useEffect } from 'react'
import personService from './communication/persons'

const Filter = ({filter, handleFilter}) => (
  <form>
  <div> filter shown with: <input value={filter} onChange={handleFilter}/></div>
  </form>
)

const Persons = ({person, removePerson}) => {
  return (
    <p> 
      {person.name} {person.number}
      <button onClick={() => {
        if (window.confirm(`Delete ${person.name}?`)) {
          //window.alert(`OK, deleting ${person.name}!`)
          removePerson(person.id)
        }
      }}>
        delete
      </button>
    </p>
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
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

useEffect (() => {
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

const removePerson = (id) => {
  const person = persons.find(p => p.id === id)
  const removedPerson = {...person}
  console.log('Poistettavan henkilön id: ', removedPerson.id)
  
  personService
    .remove(removedPerson.id)
    .then(returnedPerson => {
      setPersons(persons.filter(p => p.id !== id))
    })
    .catch(error => {
      alert(
        `Error, deleting failed`
      )
      setPersons(persons.filter(p => p.id !== id))
    })
}

const updateNumber = (newPerson) => {
  const person = persons.find(p => p.name === newPerson.name)
  console.log(person)
  const changedPerson = {...person, number: newPerson.number}
  console.log(changedPerson)

  personService
    .updateNumber(person.id, changedPerson)
    .then(returnedPerson => {
      setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
    })
    .catch(error => {
      alert(
        `Error, updating failed`
      )
      setPersons(persons.filter(p => p.id !== person.id))
    })
}

const addPerson = (event) => {
  event.preventDefault() // estetään lomakkeen lähetys
  console.log('Adding a new person...')
  const newPerson = { //Henkilö-olio
    name: newName,
    number: newNumber,
  }
  // Tutkitaan, onko henkilö jo lisätty ja annetaan varoitus, sekä poistutaan ennen henkilön lisäystä
  if (persons.find(person => person.name === newPerson.name)) {
    if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      console.log(newPerson)
      updateNumber(newPerson)
    } else {
      return (
        console.log('Number update was cancelled')
    )}
  } else {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(returnedPerson))
        console.log('New person added:', returnedPerson.name)
        setNewName('')
        setNewNumber('')
    })
  }
}

// Näytettävät henkilöt
const personsToShow = persons
.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase()))

// Nimikentän tapahtumankäsittelijä
const handleNewName = (event) => {
  setNewName(event.target.value)
}

// Puhelinkentän tapahtumankäsittelijä
const handleNewNumber = (event) => {
  setNewNumber(event.target.value)
}

const handleFilter = (event) => {
  setFilter(event.target.value)
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new contact</h2>
      <AddPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <div>
          {personsToShow.map(person =>
            <Persons key={person.id} person={person} removePerson={() => removePerson(person.id)}/>
          )}
      </div>
    </div>
  )

}

export default App