import { useState, useEffect } from 'react'
import personService from './communication/persons'
import './index.css'

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

// Ilmoituksen käsittelevä komponentti, tulostaa statusviestin, jos se ei ole null
const Notification = ( {message} ) => {
  if (message === null) {
    return null
  }
  return (
    <div className='status'> 
      {message}
    </div>
  )
}

const Error = ( {message} ) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'> 
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

// Näytetään henkilölista efektin avulla. Efekti kutsuu getAll() metodia, missä axios hakee 
useEffect (() => {  // henkilölistan serveriltä
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
    .remove(removedPerson.id) // remove metodissa axios välittää remove-pyynnön palvelimelle
    .then(returnedPerson => {
      console.log(returnedPerson)
      setPersons(persons.filter(p => p.id !== id))  // näytetään muut, paitsi poistettu henkilö
      setStatusMessage(`Person '${removedPerson.name}' was deleted`) 
      setTimeout(() => {setStatusMessage(null)}, 4000)
    })
    .catch(error => {
      setErrorMessage(`Deleting failed: Person '${removedPerson.name}' was already deleted from the server`)
      setTimeout(() => {setErrorMessage(null)}, 4000)
      setPersons(persons.filter(p => p.id !== id))
    })
}

const updateNumber = (newPerson) => {
  const person = persons.find(p => p.name === newPerson.name) // Etsitään henkilö listasta nimen perusteella
  console.log(person)
  const changedPerson = {...person, number: newPerson.number} // kopioidaan henkilöolio ja vaihdetaan number-kenttään uusi numero
  console.log(changedPerson)

  personService
    .updateNumber(person.id, changedPerson) // updateNumber metodissa axios välittää put-pyynnön palvelimelle
    .then(returnedPerson => {
      setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson)) 
      setStatusMessage(`${returnedPerson.name}'s number was updated, new number is ${returnedPerson.number}`)
      setTimeout(() => {setStatusMessage(null)}, 4000)
    })
    .catch(error => {
      //setErrorMessage(`Updating failed: Person '${changedPerson.name}' was already deleted from the server`)
      console.log(error.response.data.error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => {setErrorMessage(null)}, 4000)
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
      .create(newPerson) // create-metodissa axios välittää post-pyynnön palvelimelle
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(returnedPerson)) // liitetään uusi henkilö henkilölistaan, jotta se näkyy sivulla
        console.log('New person added:', returnedPerson.name)
        setStatusMessage(`Added '${returnedPerson.name}'`)
        setTimeout(() => {setStatusMessage(null)}, 4000)
        setNewName('') //tyhjennetään name-kenttä
        setNewNumber('') //tyhjennetään number-kenttä
    })
    .catch(error => {
      console.log(error.response.data.error)
      //console.log(`Person's '${newPerson.name}' adding was failed`)
      //setErrorMessage(`Person's '${newPerson.name}' adding was failed`)
      setErrorMessage(error.response.data.error)
      setTimeout(() => {setErrorMessage(null)}, 4000)
    })
  }
}

// Näytettävät henkilöt
const personsToShow = persons
.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

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
      <Notification message={statusMessage} />
      <Error message={errorMessage} />
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