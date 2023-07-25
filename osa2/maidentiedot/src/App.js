import axios from 'axios'
import { useState, useEffect } from 'react'
import ShowCountries from './components/ShowCountries'

const App = () => {

const [input, setInput] = useState('')
const [countries, setCountries] = useState([])
const [filteredCountries, setFilteredCountries] = useState([])

useEffect (() => { // Haetaan maiden tiedot apin kautta
  axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      console.log('axios.get response: ', response.data)
      setCountries(response.data) // tallennetaan maiden tiedot
    }).catch(error =>
      console.log(error))
}, [])

const handleInput = (event) => {
  const filter = event.target.value 
  console.log(filter)
  setInput(filter)
  // inputtia ei voi käyttää fitterinä, koska se ei päivity jatkuvasti ja filtteröi 
  // edellisen arvon perusteella, käytettääb mielummin event.target.value:a
  // periaatteessa input tila tällöin turha, mutta miten siten syötteen tallennus input-kentässä?
  if (filter) {
    const filtered = countries 
    .filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountries(filtered)
    console.log(filtered)
  }
}

  return (
    <div>
      <div>
        <form>
          Find countries: <input value={input} onChange={handleInput}/>
        </form>
      </div>
      <ShowCountries countries={filteredCountries} setCountries={setFilteredCountries}/>
    </div>
  )
}

export default App;



/*
// testailua miten api:n data tulee hakemisen jälkeen ulos
axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then(response => {
const data = response.data // datassa on 250 alkiota pitkä taulukko, yhdessä alkiossa on lukuisia muita kenttiä
console.log(data)
const name = data[0].name // ensimmäisen alkion nimikentät
console.log(name);
const common = name.common // ensimmäisen alkion nimikentän common-kenttä (eli yleisin käytetty nimi)
console.log(common); // nyt päästy käsiksi yhden valtion nimeen
})*/

/*
// API:n toisen sivun kokeilu, esimerkkinä Espanjan tiedot
axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/spain`).then(response => {
const data = response.data
console.log(data)
/*const name = data.name // maan nimet
console.log(name);
const common = name.common // nimikentän common-kenttä (eli yleisin käytetty nimi)
console.log(common); // nyt päästy käsiksi Espanjan nimeen

// mites muut kentät, haluttiin nimi, pääkaupunki, pinta-ala, kielet ja lippu
console.log(`Capital: ${data.capital}, Area: ${data.area}, Languages: ${data.languages}`)
const pic = data.flags.png
console.log(pic)
setPicture(pic)
})*/