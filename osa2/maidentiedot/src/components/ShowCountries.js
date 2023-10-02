import Country from "./Country"

const ShowCountries = ({ countries, setCountries }) => {
    console.log('Countries-parameter contains: ', countries, ' and its type is: ', typeof countries)
    if (countries.length > 10) { // jos tuloksia yli 10, ei näytetä maita vaan pyydetään tarkentamaan filtteriä
      return (<p>Too many matches, improve filter</p>)
    }
    else if (countries.length === 1) { // jos maita näytettävissä vain yksi, näytä tarkemmat maan tiedot Country-komponentin avulla
      return(<Country country={countries[0]}/>)
    }
    else {
      return(
        <div>
          {countries.map((country, i) => <p key={i}>{country.name.common} <button onClick={() => setCountries([country])}>show</button></p>)} 
          {/* muussa tapauksessa (1 < x <= 10 tulosta) näytetään lista maista, jotka sisältää filtterin
          Huom. komponenttia ei voi kutsua buttonin onClick metodissa, asia täytyy hoitaa tilan muutoksella*/} 
        </div>
      )
    }
}

export default ShowCountries