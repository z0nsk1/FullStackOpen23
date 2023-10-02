import { useEffect, useState } from "react"
import axios from "axios"

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  //console.log('Country to be shown: ', country.name.common)

  useEffect (() => {
    const api_key = process.env.REACT_APP_API_KEY
    if (country) {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data) // tilan muutos renderöi komponentin uudestaan
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
    }
  },[])

  if (weather !== null) { // Jos sää on null, ei renderöidä säätietoja (error), kokeiltu samaa käyttäen tilana 
    // tyhjää taulukkoa ja ehtona weather.length > 0, ei kuitenkaan toiminut, miksi?
    // muista, hook (useEffect) renderöityy vasta ensimmäisen renderöinnin (return) jälkeen
    console.log(weather.weather[0].icon)
    console.log(weather)
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p> 
        <p>Area {country.area}</p>
        <h3>Languages: </h3>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)} 
          {/*mapataan olion country kentän languages arvot li-elementteihin, tämä siksi, 
          jos puhuttuja kieliä on useampi*/}
        </ul>
        <img src={country.flags.png} alt="flag" border="1px black" width="20%" height="20%"/>
      <h2>Weather in {country.capital}</h2>
      <p>{`Temperature ${weather.main.temp} Celcius`}</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather"/>
      <p>{`Wind ${weather.wind.speed} m/s`}</p>
      </div>
    )  
  }
}

  export default Country