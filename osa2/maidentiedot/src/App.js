import axios from 'axios'
import { useState, useEffect } from 'react';

const Find = ({ input, handleInput }) => (
    <form>
      <p>Find countries <input value={input} onChange={handleInput}/></p>
    </form>
)

const Country = ({ country }) => {
  console.log('Country-object in Country-component: ', country);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p> 
      <p>Area {country.area}</p>
      <h3>Languages: </h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
    </div>
  )
}

const Picture = ({ pic }) => {
  console.log('Type of picture variable in Picture-component: ', typeof pic)
  return (
    <img src={pic} alt="flag" border="1px black"/>
  )
}
const App = () => {

const [input, setInput] = useState('finland')
const [country, setCountry] = useState(null)
const [picture, setPicture] = useState(null)

useEffect (() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/finland`)
      .then(response => {
        console.log('axios.get response: ', response.data)
        setCountry(response.data)
        setPicture(response.data.flags.png)
      })
}, [])

// estetään renderöinti, jos country on tyhjä vielä
if (!country) {
  return null
}

const handleInput = (event) => {
  console.log(event.target.value)
  setInput(event.target.value)
}

  return (
    <div>
      <Find input={input} handleInput={handleInput}/>
      <Country country={country}/>
      <Picture pic={picture}/>
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
