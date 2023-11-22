import axios from 'axios'
import { useState, useEffect } from 'react'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    if (name) { // Estetään turha get-metodin suoritus ja virheilmoitus sovelluksen käynnistyessä, kun name on tyhjä
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(res => {
        console.log(res)
        setCountry(res) // Jos maa löytyi, asetetaan se "country" arvoksi
        setFound(true) // Laitetaan found arvoksi true
      })
      .catch(error => {
        setFound(false) // Jos epäonnistui, laitetaan found takaisin false
        console.log(error)
      })
    }
  }, [name]) // Päivitetään aina, kun nimi muuttuu

  if (country) { // if-ehtoa tarvitaan, koska countryn initial state on null ja nulliin ei luonnollisesti voi lisätä kenttiä, joten se heittää virheilmoituksen
    country.found = found // Lisätään found country-olion kentäksi
  }

  return country // Palautetaan country, joka on axioksen response-olio, johon on lisätty found-kenttä
}